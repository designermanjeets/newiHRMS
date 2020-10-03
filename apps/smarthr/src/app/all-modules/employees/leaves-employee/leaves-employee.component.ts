import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllModulesService } from '../../all-modules.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { GET_USERLEAVES_QUERY, RegisterLeaveGQL } from './leave-emp-gql.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { GET_LEAVETYPES_QUERY } from '../leave-settings/leavesettingql.service';

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
  public addLeaveadminForm: FormGroup;
  public editLeaveadminForm: FormGroup;
  public editFromDate: any;
  public editToDate: any;

  allLeaveTypes: any;
  allLeaveApplied: any;

  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private apollo: Apollo,
    private registerLeaveGQL: RegisterLeaveGQL,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.loadallLeaveTypes();
    this.loadallLeaveApplied();

    this.addLeaveadminForm = this.formBuilder.group({
      leavetype: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      nofdays: ['', [Validators.required]],
      remaingleaves: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    });

    // Edit leaveadmin Form Validation And Getting Values

    this.editLeaveadminForm = this.formBuilder.group({
      _id: [''],
      leavetype: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      nofdays: ['', [Validators.required]],
      remaingleaves: ['', [Validators.required]],
      reason: ['', [Validators.required]],
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
        console.log(this.allLeaveApplied);
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
    this.addLeaveadminForm.reset();
  }

  onltypechange(value) {
    const lt = this.allLeaveApplied.filter((item) => item._id === value.value);
    this.addLeaveadminForm.get('remaingleaves').patchValue(lt[0].leavedays);
  }

  // Get leave  Api Call
  loadLeaves() {
    //
  }

  // Add leaves for admin Modal Api Call
  addleaves(f) {
    console.log(f.value);

    const lv = _.filter(this.allLeaveApplied, p => p._id === f.value.leavetype);
    console.log(lv);

    this.registerLeaveGQL
      .mutate({
        user_ID: JSON.parse(sessionStorage.getItem('user')).userid,
        leavetype: lv[0].leavetype,
        leave_ID: lv[0]._id,
        nofdays: f.value.nofdays,
        reason: f.value.reason,
        from: f.value.from,
        to: f.value.to,
        created_at: Date.now(),
        created_by: JSON.parse(sessionStorage.getItem('user')).username
      })
      .subscribe( (val: any) => {
        if (val.data) {
          console.log(val.data);
          this.toastr.success('Leave Applied added sucessfully...!', 'Success');
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
  editLeaves() {
    //
  }

  // Delete leaves Modal Api Call

  deleteleaves() {
    //
  }

  // To Get The leaves Edit Id And Set Values To Edit Modal Form

  edit(id) {
    this.editLeaveadminForm.reset();
    console.log(id);
    _.forEach(this.allLeaveApplied,  lv => {
      lv['remaingleaves'] = 0;
      moment(lv.from).format('DD-MM-YYYY');
      moment(lv.to).format('DD-MM-YYYY');
    });
    let l = this.allLeaveApplied.find((item) => item._id === id);
    console.log(l);
    this.editLeaveadminForm.patchValue(l);
    this.editLeaveadminForm.get('leavetype').patchValue(l.leave_ID);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }
}
