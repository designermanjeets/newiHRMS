import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AllModulesService } from '../../all-modules.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import {
  ApproveORejectLeaveGQL,
  DeleteLeaveGQL,
  GET_USER_QUERY,
  GET_USERLEAVES_QUERY,
  RegisterLeaveGQL,
  UpdateLeaveGQL
} from './leave-emp-gql.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { GET_LEAVETYPES_QUERY } from '../leave-settings/leavesettingql.service';
import { debounceTime, distinctUntilChanged, pairwise } from 'rxjs/operators';
import { Subscription } from 'rxjs';

declare const $: any;

@Component({
  selector: 'app-leaves-employee',
  templateUrl: './leaves-employee.component.html',
  styleUrls: ['./leaves-employee.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeavesEmployeeComponent implements OnInit, OnDestroy {
  lstLeave: any[];
  url: any = 'employeeleaves';
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
  tempLv: any;
  nofSub: Subscription;
  currUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private apollo: Apollo,
    private registerLeaveGQL: RegisterLeaveGQL,
    private updateLeaveGQL: UpdateLeaveGQL,
    private deleteLeaveGQL: DeleteLeaveGQL,
    private approveorejectLeave: ApproveORejectLeaveGQL,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.getUser();

    this.editLeaveadminForm = this.formBuilder.group({
      _id: [''],
      leaveType: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      numberOfDays: ['', [Validators.required]],
      remainingLeaves: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    }); // ,{ validator: this.checkLeaveDays }
    this.calcRemainingOnFly();
  }

  checkLeaveDays(group: FormGroup) {
    const fromCtrl = group.controls.from.value;
    const toCtrl = group.controls.to.value;

    return fromCtrl <= toCtrl ? null : { notSame: true };
  }

  calcRemainingOnFly() { // Not in Use currently
    const reminCtr = this.editLeaveadminForm.get('remainingLeaves') as FormControl;
    this.nofSub = this.editLeaveadminForm.get('numberOfDays').valueChanges
      .pipe(
        // debounceTime(100),
        distinctUntilChanged(),
        pairwise() // gets a pair of old and new value
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue >= Number(this.remainTemp)) {
          this.editLeaveadminForm.get('numberOfDays').patchValue(this.remainTemp);
          // reminCtr.patchValue(this.remainTemp);
        } else {
          // reminCtr.patchValue(this.remainTemp - newValue);
        }
      });
  }

  getRowClass = (row) => {
    return {
      'row-danger': row.status === 'rejected',
      'row-success': row.status === 'approved',
    };
  }

  getUser() {
    this.apollo.watchQuery({
      query: GET_USER_QUERY,
      variables: {
        query: {
          id: JSON.parse(sessionStorage.getItem('user')).userid
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data.users) {
        this.currUser = response.data.users[0];
        this.rows = this.currUser.leaveApplied;
        // this.srch = [...this.rows];
        this.cdRef.detectChanges();
      }
    });
  }

  addReset() {
    this.isEdit = false;
    this.editLeaveadminForm.reset();
    this.tempEditUserID = JSON.parse(sessionStorage.getItem('user')).userid;
    this.editLeaveadminForm.get('leaveType').enable();
    this.getUserPendingLeaves();
  }

  onltypechange(value) {
    this.calculatePendingLeaves(value.value); // Select Option - LeaveID
  }

  calculatePendingLeaves(leaveID) { // In case of Loop Through
    if (this.checkPendingLeaveForUser) {
      const f = _.filter(this.checkPendingLeaveForUser, v => v.leaveID === leaveID);
      console.log(f[0]); // Get User's Designation's Assigned Leave Type :: CL, PL ETC
      this.editLeaveadminForm.get('remainingLeaves').patchValue(f[0].remainingLeaves);
      this.remainTemp = JSON.parse(JSON.stringify(f[0].remainingLeaves));
    }
  }

  getUserPendingLeaves(l?) { // Para for Edit Only
    this.checkPendingLeaveForUser = this.currUser.designation.leaveType;
    _.forEach(this.checkPendingLeaveForUser, vl => {
      if (vl.remainingLeaves === null || vl.remainingLeaves === 'undefined') {
        vl.remainingLeaves = vl.leaveDays;
      }
    });
    (this.isEdit && l) && this.onltypechange({value: l.leaveID}); // Only After Response
    this.cdRef.detectChanges();
  }

  // Add leaves for admin Modal Api Call
  addleaves(f) {

    const lv = _.filter(this.currUser.designation.leaveType, p => p.leaveID === f.value.leaveType);

    this.registerLeaveGQL
      .mutate({
        userID: JSON.parse(sessionStorage.getItem('user')).userid,
        username: JSON.parse(sessionStorage.getItem('user')).username,
        email: JSON.parse(sessionStorage.getItem('user')).email,
        employeeID: JSON.parse(sessionStorage.getItem('user')).employeeID,
        leaveType: lv[0].leaveType,
        leaveID: lv[0].leaveID,
        numberOfDays: f.value.numberOfDays,
        remainingLeaves: f.value.remainingLeaves,
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
          this.getUser();
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

    const lv = _.filter(this.currUser.leaveApplied, p => p._id === f.value._id);

    this.updateLeaveGQL
      .mutate({
        id: lv[0]._id,
        userID: JSON.parse(sessionStorage.getItem('user')).userid,
        username: JSON.parse(sessionStorage.getItem('user')).username,
        email: JSON.parse(sessionStorage.getItem('user')).email,
        employeeID: JSON.parse(sessionStorage.getItem('user')).employeeID,
        leaveType: lv[0].leaveType,
        leaveID: lv[0].leaveID,
        numberOfDays: f.value.numberOfDays,
        remainingLeaves: f.value.remainingLeaves,
        reason: f.value.reason,
        from: f.value.from,
        to: f.value.to,
        modified: {
          modified_at: Date.now(),
          modified_by: JSON.parse(sessionStorage.getItem('user')).username
        }
      })
      .subscribe( (val: any) => {
        if (val.data) {
          this.editLeaveadminForm.reset();
          $('#edit_leave').modal('hide');
          this.toastr.success('Leave Updated sucessfully...!', 'Success');
          this.getUser();
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
          userID: JSON.parse(sessionStorage.getItem('user')).userid,
          modified: {
            modified_by: JSON.parse(sessionStorage.getItem('user')).username,
            modified_at: Date.now()
          }
        })
        .subscribe((val: any) => {
            if (val.data.deleteLeave) {
              $('#delete_approve').modal('hide');
              this.getUser();
              this.toastr.success('Leave deleted', 'Success');
            }
          }, error =>
            this.toastr.error(error, 'Error')
        );
    } else {
      $('#delete_approve').modal('hide');
    }
  }

  // To Get The leaves Edit Id And Set Values To Edit Modal Form

  edit(id) {
    this.isEdit = true;
    this.tempEditUserID = null;
    this.editLeaveadminForm.reset();
    const l = this.currUser.leaveApplied.find((item) => item._id === id);
    console.log(l);
    this.tempEditUserID = l.userID;
    this.editLeaveadminForm.patchValue(l);
    this.editLeaveadminForm.get('leaveType').patchValue(l.leaveID);
    this.editLeaveadminForm.get('leaveType').disable();
    this.cdRef.detectChanges();

    // On Load get the Select Assigned Leave Type
    this.getUserPendingLeaves(l); // For Edit Only

  }

  apprRejctedit(lv) {
    this.tempLv = lv;
  }

  approveleave(status) {
    if (status === 'pending') {
      this.approveorejectLeave
        .mutate({
          id: this.tempLv._id,
          userID: JSON.parse(sessionStorage.getItem('user')).userid,
          leaveType: this.tempLv.leaveType,
          leaveID: this.tempLv.leaveID,
          numberOfDays: this.tempLv.numberOfDays,
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
            console.log(val.data);
            this.editLeaveadminForm.reset();
            $('#approverejectmodal').modal('hide');
            this.toastr.success('Leave Updated sucessfully...!', 'Success');
            this.cdRef.detectChanges();
          }
        }, error => this.toastr.error(error, 'Error'));
    } else {
      $('#approverejectmodal').modal('hide');
    }

  }

  rejectleave(status) {
    if (status === 'pending') {
    this.approveorejectLeave
      .mutate({
        id: this.tempLv._id,
        userID: JSON.parse(sessionStorage.getItem('user')).userid,
        leaveType: this.tempLv.leaveType,
        leaveID: this.tempLv.leaveID,
        numberOfDays: this.tempLv.numberOfDays,
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
          console.log(val.data);
          this.editLeaveadminForm.reset();
          $('#approverejectmodal').modal('hide');
          this.toastr.success('Leave Updated sucessfully...!', 'Success');
          this.cdRef.detectChanges();
        }
      }, error => this.toastr.error(error, 'Error'));
    } else {
      $('#approverejectmodal').modal('hide');
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }
}
