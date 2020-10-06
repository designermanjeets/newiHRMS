import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AllModulesService } from '../../all-modules.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { GET_USER_QUERY, GET_USERLEAVES_QUERY, RegisterLeaveGQL, UpdateLeaveGQL } from './leave-emp-gql.service';
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
  nofSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private apollo: Apollo,
    private registerLeaveGQL: RegisterLeaveGQL,
    private updateLeaveGQL: UpdateLeaveGQL,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.loadallLeaveTypes();
    this.loadallLeaveApplied();

    this.editLeaveadminForm = this.formBuilder.group({
      _id: [''],
      leavetype: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      nofdays: ['', [Validators.required]],
      remainingleaves: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    });
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
          // this.editLeaveadminForm.get('nofdays').patchValue(this.remainTemp);
          reminCtr.patchValue(this.remainTemp);
        } else {
          reminCtr.patchValue(this.remainTemp - newValue);
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
        this.rows = this.allLeaveApplied;
        this.srch = [...this.rows];
        this.cdRef.detectChanges();
      }
    });
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

  addReset() {
    this.isEdit = false;
    this.editLeaveadminForm.reset();
    this.tempEditUserID = JSON.parse(sessionStorage.getItem('user')).userid;
    this.editLeaveadminForm.get('leavetype').enable();
    this.getUserPendingLeaves();
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
          id: this.tempEditUserID
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

    this.registerLeaveGQL
      .mutate({
        user_ID: JSON.parse(sessionStorage.getItem('user')).userid,
        username: JSON.parse(sessionStorage.getItem('user')).username,
        email: JSON.parse(sessionStorage.getItem('user')).email,
        emmpid: JSON.parse(sessionStorage.getItem('user')).emmpid,
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

  deleteleaves() {
    //
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

    // On Load get the Select Assigned Leave Type
    this.getUserPendingLeaves(l); // For Edit Only

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }
}
