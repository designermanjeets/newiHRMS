import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AllModulesService } from '../../all-modules.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { distinctUntilChanged, pairwise, map, startWith } from 'rxjs/operators';
import {
  ApproveORejectLeaveGQL,
  DeleteLeaveGQL,
  GET_USER_QUERY,
  GET_USERLEAVES_QUERY,
  RegisterLeaveGQL,
  UpdateLeaveGQL
} from '../leaves-employee/leave-emp-gql.service';
import { GET_LEAVETYPES_QUERY } from '../leave-settings/leavesettingql.service';
import { Apollo } from 'apollo-angular';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
declare const $: any;
import * as _ from 'lodash';
import * as moment from 'moment';
import { GET_USERS_QUERY } from '../all-employees/employee-gql.service';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { GetUserRoles } from './leave-admin-gql.service';

// Returns an array of dates between the two dates
export const getDatesBetween = (startDate, endDate) => {
  const dates = [];

  // Strip hours minutes seconds etc.
  let currentDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  while (currentDate <= endDate) {
    dates.push(currentDate);

    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1, // Will increase month if over range
    );
  }

  return dates;
};

@Component({
  selector: 'app-leaves-admin',
  templateUrl: './leaves-admin.component.html',
  styleUrls: ['./leaves-admin.component.css'],
})

export class LeavesAdminComponent implements OnInit, OnDestroy {
  public lstLeave: any;
  public url: any = 'adminleaves';
  public tempId: any;
  public editId: any;

  rows = [];
  selected = [];
  columns: any[] = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  public srch = [];
  public statusValue;
  public pipe = new DatePipe('en-US');
  public editLeaveadminForm: FormGroup;
  public editFromDate: any;
  public editToDate: any;
  tempEditUserID: any;
  isEdit = true;

  allLeaveTypes: any;
  userLeaveTypes: [];
  allLeaveApplied: any;
  checkPendingLeaveForUser: any;
  remainTemp: any;
  nofSub: Subscription;
  tempLv: any;
  allusers: [] = [];
  selectedUser: any;
  isManager: boolean;
  isAdmin: boolean;
  isHRManager: boolean;

  useroptions: any[] = [];
  filteredOptions: Observable<string[]>;
  todaysleaves: any;
  approvedleaves: any;
  pendingleaves: any;

  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private apollo: Apollo,
    private registerLeaveGQL: RegisterLeaveGQL,
    private updateLeaveGQL: UpdateLeaveGQL,
    private deleteLeaveGQL: DeleteLeaveGQL,
    private approveorejectLeave: ApproveORejectLeaveGQL,
    private cdRef: ChangeDetectorRef,
    private getUserRoles: GetUserRoles
  ) {}

  ngOnInit() {

    this.loadallLeaveTypes();
    this.loadallLeaveApplied();
    this.loadallUsers();

    this.isAdmin = this.getUserRoles.isAdmin;
    this.isHRManager = this.getUserRoles.isHRManager;
    this.isManager = this.getUserRoles.isManager;

    this.editLeaveadminForm = this.formBuilder.group({
      _id: [''],
      selectEmp: ['', [Validators.required]],
      leavetype: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      nofdays: ['', [Validators.required]],
      remainingleaves: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    }, { validator: this.checkLeaveDays });

    this.calcRemainingOnFly();

    this.filteredOptions = this.editLeaveadminForm.get('selectEmp').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value && value.toLowerCase();

      return this.useroptions.filter(option => option.email.toLowerCase().includes(filterValue));
    }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    const usr = _.filter(this.allusers, v => v.email === event.option.value);
    this.selectedUser = usr[0];
    this.getUserPendingLeaves();
  }

  checkLeaveDays(group: FormGroup) {
    const fromCtrl = group.controls.from.value;
    const toCtrl = group.controls.to.value;

    return fromCtrl <= toCtrl ? null : { notSame: true };
  }

  calcRemainingOnFly() { // Not in Use currently
    const reminCtr = this.editLeaveadminForm.get('remainingleaves') as FormControl;
    this.nofSub = this.editLeaveadminForm.get('nofdays').valueChanges
      .pipe(
        // debounceTime(100),
        distinctUntilChanged(),
        pairwise() // gets a pair of old and new value
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue && newValue >= Number(this.remainTemp)) {
          this.editLeaveadminForm.get('nofdays').patchValue(this.remainTemp);
          // reminCtr.patchValue(this.remainTemp);
        } else {
          // reminCtr.patchValue(this.remainTemp - newValue);
        }
      });
  }

  getRowClass = (row) => {
    return {
      'row-danger': row.status === 'pending',
      'row-success': row.status === 'approved',
    };
  }

  loadallLeaveApplied() {
    this.apollo.watchQuery({
      query: GET_USERLEAVES_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data.getLeavesApplied) {
        this.allLeaveApplied = response.data.getLeavesApplied;
        this.srch = this.allLeaveApplied;
        this.rows = [...this.srch];
        this.todaysleaves = [];
        this.pendingleaves = [];
        this.approvedleaves = [];
        _.forEach(this.allLeaveApplied, l => {
          if ((new Date(l.from) <= new Date(Date.now()) && (new Date(Date.now()) <= new Date(l.to)))) {
            this.todaysleaves.push(l);
          }
          if (l.status === 'pending') {
            this.pendingleaves.push(l);
          }
          if (l.status === 'approved' || l.status === 'authorized') {
            this.approvedleaves.push(l);
          }
        });

        this.cdRef.detectChanges();
      }
    });
  }

  getStandAge(startDate) {
    const age = moment().diff(startDate, 'months'); return isNaN(age) ? null : age;
  }

  loadallLeaveTypes() {
    this.apollo.watchQuery({
      query: GET_LEAVETYPES_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data.getLeaveTypes) {
        this.allLeaveTypes = response.data.getLeaveTypes;
        this.cdRef.detectChanges();
      }
    });
  }

  loadallUsers() {
    this.apollo.watchQuery({
      query: GET_USERS_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data.users) {
        this.allusers = response.data.users;
        this.useroptions = [];
        _.forEach(this.allusers, val => this.useroptions.push({ _id: val._id ,email: val.email }));
        this.cdRef.detectChanges();
      }
    });
  }

  addReset() {
    this.isEdit = false;
    this.editLeaveadminForm.reset();
    // this.tempEditUserID = JSON.parse(sessionStorage.getItem('user')).userid;
    this.editLeaveadminForm.get('leavetype').enable();
  }

  onltypechange(value) {
    this.calculatePendingLeaves(value.value); // Select Option - LeaveID
  }

  calculatePendingLeaves(leaveID) { // In case of Loop Through
    if (this.checkPendingLeaveForUser) {
      const f = _.filter(this.checkPendingLeaveForUser, v => v.leave_ID === leaveID);
      console.log(f[0]); // Get User's Designation's Assigned Leave Type :: CL, PL ETC
      this.editLeaveadminForm.get('remainingleaves').patchValue(f[0].remainingleaves);
      this.remainTemp = JSON.parse(JSON.stringify(f[0].remainingleaves));
    }
  }

  getUserPendingLeaves(l?) { // Para for Edit Only
    this.apollo.watchQuery({
      query: GET_USER_QUERY,
      variables: {
        query: {
          id: this.selectedUser._id
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data.users) {
        this.checkPendingLeaveForUser = response.data.users[0].designation.leavetype;
        _.forEach(this.checkPendingLeaveForUser, vl => {
          if (vl.remainingleaves === null || vl.remainingleaves === 'undefined') {
            vl.remainingleaves = vl.leavedays;
          }
        });
        (this.isEdit && l) && this.onltypechange({value: l.leave_ID}); // Only After Response
        this.cdRef.detectChanges();
      }
    }, error => this.toastr.error(error, 'Error'));
  }

  // Add leaves for admin Modal Api Call
  addleaves(f) {

    const lv = _.filter(this.allLeaveTypes, p => p._id === f.value.leavetype);
    const us = _.filter(this.allusers, p => p.email === f.value.selectEmp);

    this.registerLeaveGQL
      .mutate({
        user_ID: us[0]._id,
        username: us[0].username,
        email: us[0].email,
        emmpid: us[0].emmpid,
        leavetype: lv[0].leavetype,
        leave_ID: lv[0]._id,
        nofdays: f.value.nofdays,
        remainingleaves: f.value.remainingleaves,
        reason: f.value.reason,
        from: f.value.from,
        to: f.value.to,
        created_at: Date.now(),
        created_by: JSON.parse(sessionStorage.getItem('user')).username
      })
      .subscribe( (val: any) => {
        if (val.data) {
          this.editLeaveadminForm.reset();
          $('#add_leave').modal('hide');
          this.toastr.success('Leave Applied added sucessfully...!', 'Success');
          this.loadallLeaveApplied();
          this.cdRef.detectChanges();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  from(data) {
    this.editFromDate = this.pipe.transform(data, 'dd-MM-yyyy');
  }
  to(data) {
    this.editToDate = this.pipe.transform(data, 'dd-MM-yyyy');
  }

  // Edit leaves Modal Api Call
  editLeaves(f) {

    const lv = _.filter(this.allLeaveApplied, p => p._id === f.value._id);

    this.updateLeaveGQL
      .mutate({
        id: lv[0]._id,
        user_ID: JSON.parse(sessionStorage.getItem('user')).userid,
        username: JSON.parse(sessionStorage.getItem('user')).username,
        email: JSON.parse(sessionStorage.getItem('user')).email,
        emmpid: JSON.parse(sessionStorage.getItem('user')).emmpid,
        leavetype: lv[0].leavetype,
        leave_ID: lv[0].leave_ID,
        nofdays: f.value.nofdays,
        remainingleaves: f.value.remainingleaves,
        reason: f.value.reason,
        from: f.value.from,
        to: f.value.to,
        created_at: Date.now(),
        created_by: JSON.parse(sessionStorage.getItem('user')).username
      })
      .subscribe( (val: any) => {
        if (val.data) {
          this.editLeaveadminForm.reset();
          $('#edit_leave').modal('hide');
          this.toastr.success('Leave Updated sucessfully...!', 'Success');
          this.loadallLeaveApplied();
          this.cdRef.detectChanges();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  // Delete leaves Modal Api Call

  deleteleave() {
    if (this.tempId.status === 'pending') {
    this.deleteLeaveGQL
      .mutate({
        id: this.tempId._id,
        status: this.tempId.status,
        user_ID: this.tempId.user_ID,
        modified: {
          modified_by: JSON.parse(sessionStorage.getItem('user')).username,
          modified_at: Date.now()
        }
      })
      .subscribe( (val: any) => {
          if (val.data.deleteLeave) {
            $('#delete_approve').modal('hide');
            this.toastr.success('Leave deleted', 'Success');
            this.loadallLeaveApplied();
          }
        }, error =>
          this.toastr.error(error, 'Error')
      );
    }
  }

  // To Get The leaves Edit Id And Set Values To Edit Modal Form

  edit(id) {
    this.isEdit = true;
    this.remainTemp = null;
    this.tempEditUserID = null;
    this.editLeaveadminForm.reset();
    let l = this.allLeaveApplied.find((item) => item._id === id);
    console.log(l);
    this.tempEditUserID = l.user_ID;
    this.editLeaveadminForm.patchValue(l);
    this.editLeaveadminForm.get('leavetype').patchValue(l.leave_ID);
    this.editLeaveadminForm.get('leavetype').disable();
    this.cdRef.detectChanges();

    // On Load get the Select Assigned Leave Type
    this.getUserPendingLeaves(l); // For Edit Only

  }

  // search by name
  searchName(val) {
    this.rows = this.srch.filter(d => {
      val = val.toString().toLowerCase().trim();
      return d.username.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  // search by status
  searchType(val) {
      this.rows = this.srch.filter(d => {
        val = val.toString().toLowerCase().trim();
        return d.leavetype.toLowerCase().indexOf(val) !== -1 || !val;
      });
  }

  searchStatus(val) {
    this.rows = this.srch.filter(d => {
      val = val.toString().toLowerCase().trim();
      return d.status.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  // search by purchase
  searchByFrom(val) {

    this.rows = this.srch.filter(d => {
      const mySimpleFormat = moment(val).toISOString();
      return d.from.toLowerCase().indexOf(mySimpleFormat) !== -1 || !mySimpleFormat;
    });
    $('.floating')
      .on('focus blur', function(e) {
        $(this)
          .parents('.form-focus')
          .toggleClass('focused', e.type === 'focus' || this.value.length > 0);
      })
      .trigger('blur');
  }

  // search by warranty
  searchByTo(val) {

    this.rows = this.srch.filter(d => {
      const mySimpleFormat = moment(val).toISOString();
      return d.to.toLowerCase().indexOf(mySimpleFormat) !== -1 || !mySimpleFormat;
    });

    $('.floating')
      .on('focus blur', function(e) {
        $(this)
          .parents('.form-focus')
          .toggleClass('focused', e.type === 'focus' || this.value.length > 0);
      })
      .trigger('blur');
  }

  // getting the status value
  getStatus(data) {
    this.statusValue = data;
  }

  apprRejctedit(lv) {
    this.tempLv = lv;
  }

  approveleave(status) {
    if (this.tempLv.status === 'pending') {
      this.approveorejectLeave
        .mutate({
          id: this.tempLv._id,
          user_ID: this.tempLv.user_ID,
          leavetype: this.tempLv.leavetype,
          leave_ID: this.tempLv.leave_ID,
          nofdays: this.tempLv.nofdays,
          status: status,
          approvedBy: {
            approvedByID: JSON.parse(sessionStorage.getItem('user')).userid,
            approvedByUserName: JSON.parse(sessionStorage.getItem('user')).username
          },
          modified: {
            modified_at: Date.now(),
            modified_by: JSON.parse(sessionStorage.getItem('user')).username
          }
        })
        .subscribe( (val: any) => {
          if (val.data) {
            this.tempLv = null;
            this.editLeaveadminForm.reset();
            $('#approverejectmodal').modal('hide');
            this.toastr.success('Leave Updated sucessfully...!', 'Success');
            this.loadallLeaveApplied();
            this.cdRef.detectChanges();
          }
        }, error => this.toastr.error(error, 'Error'));
    } else {
      $('#approverejectmodal').modal('hide');
    }

    if (status === 'authorized') {
      this.approveorejectLeave
        .mutate({
          id: this.tempLv._id,
          user_ID: this.tempLv.user_ID,
          leavetype: this.tempLv.leavetype,
          leave_ID: this.tempLv.leave_ID,
          nofdays: this.tempLv.nofdays,
          status: status,
          authorizedBy: {
            authorizedByID: JSON.parse(sessionStorage.getItem('user')).userid,
            authorizedByUserName: JSON.parse(sessionStorage.getItem('user')).username
          },
          modified: {
            modified_at: Date.now(),
            modified_by: JSON.parse(sessionStorage.getItem('user')).username
          }
        })
        .subscribe( (val: any) => {
          if (val.data) {
            this.tempLv = null;
            this.editLeaveadminForm.reset();
            $('#authdeclinemodal').modal('hide');
            this.toastr.success('Leave Updated sucessfully...!', 'Success');
            this.loadallLeaveApplied();
            this.cdRef.detectChanges();
          }
        }, error => this.toastr.error(error, 'Error'));
    } else {
      $('#authdeclinemodal').modal('hide');
    }

  }

  rejectleave(status) {
    if (this.tempLv.status === 'pending') {
      this.approveorejectLeave
        .mutate({
          id: this.tempLv._id,
          user_ID: this.tempLv.user_ID,
          leavetype: this.tempLv.leavetype,
          leave_ID: this.tempLv.leave_ID,
          nofdays: this.tempLv.nofdays,
          status: status,
          rejectedBy: {
            rejectedByID: JSON.parse(sessionStorage.getItem('user')).userid,
            rejectedByUserName: JSON.parse(sessionStorage.getItem('user')).username
          },
          modified: {
            modified_at: Date.now(),
            modified_by: JSON.parse(sessionStorage.getItem('user')).username
          }
        })
        .subscribe( (val: any) => {
          if (val.data) {
            this.tempLv = null;
            this.editLeaveadminForm.reset();
            $('#approverejectmodal').modal('hide');
            this.toastr.success('Leave Updated sucessfully...!', 'Success');
            this.loadallLeaveApplied();
            this.cdRef.detectChanges();
          }
        }, error => this.toastr.error(error, 'Error'));
    } else {
      $('#approverejectmodal').modal('hide');
    }

    if (status === 'declined') {
      this.approveorejectLeave
        .mutate({
          id: this.tempLv._id,
          user_ID: this.tempLv.user_ID,
          leavetype: this.tempLv.leavetype,
          leave_ID: this.tempLv.leave_ID,
          nofdays: this.tempLv.nofdays,
          status: status,
          declinedBy: {
            declinedByID: JSON.parse(sessionStorage.getItem('user')).userid,
            declinedByUserName: JSON.parse(sessionStorage.getItem('user')).username
          },
          modified: {
            modified_at: Date.now(),
            modified_by: JSON.parse(sessionStorage.getItem('user')).username
          }
        })
        .subscribe( (val: any) => {
          if (val.data) {
            this.tempLv = null;
            this.editLeaveadminForm.reset();
            $('#authdeclinemodal').modal('hide');
            this.toastr.success('Leave Updated sucessfully...!', 'Success');
            this.loadallLeaveApplied();
            this.cdRef.detectChanges();
          }
        }, error => this.toastr.error(error, 'Error'));
    } else {
      $('#authdeclinemodal').modal('hide');
    }

  }

  authLeave(row) {
    $('#authdeclinemodal').modal('show');
    this.tempLv = row;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }
}
