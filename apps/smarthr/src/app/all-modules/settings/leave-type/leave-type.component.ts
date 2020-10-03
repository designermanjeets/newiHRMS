import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Apollo } from 'apollo-angular';
import { DeleteLeaveTypeGQL, GET_LEAVETYPES_QUERY, RegisterLeaveTypeGQL, UpdateLeaveTypeGQL } from './leave-types-gql.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

declare const $: any;

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveTypeComponent implements OnInit, OnDestroy {
  public url: any = 'leaveType';
  public allLeaveType: any = [];
  public editId: any;
  public tempId: any;

  uptForm: FormGroup;
  addForm: FormGroup;
  actionParams: any;


  rows = [];
  selected = [];
  columns: any[];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private allModuleService: AllModulesService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private apollo: Apollo,
    private registerLeaveTypeGQL: RegisterLeaveTypeGQL,
    private updateLeaveTypeGQL: UpdateLeaveTypeGQL,
    private deleteLeaveTypeGQL: DeleteLeaveTypeGQL,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {

    this.getLeaveTypes();

    this.uptForm = this.fb.group({
      _id: [''],
      leavetype: ['', Validators.required],
      leavedays: ['', Validators.required],
      carryforward: ['', Validators.required],
      carrymax: ['0'],
      status: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      _id: [''],
      leavetype: ['', Validators.required],
      leavedays: ['', Validators.required],
      carryforward: ['', Validators.required],
      carrymax: ['0'],
      status: ['', Validators.required]
    });
  }

  getLeaveTypes() {
    this.apollo.watchQuery({
      query: GET_LEAVETYPES_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data.getLeaveTypes.length) {
        this.rows = [];
        this.allLeaveType = response.data.getLeaveTypes;
        this.rows = this.allLeaveType;
        this.cdRef.detectChanges();
      }
    }, error => this.toastr.error(error, 'Error'));
  }

  // Add Provident Modal Api Call

  addLeavetype(f) {
    this.registerLeaveTypeGQL
      .mutate({
        leavetype: f.value.leavetype,
        leavedays: f.value.leavedays,
        carryforward: f.value.carryforward,
        carrymax: f.value.carrymax,
        status: f.value.status,
        created_by: JSON.parse(sessionStorage.getItem('user')).username,
        created_at: Date.now(),
      })
      .subscribe((val: any) => {
        if (val.data.createLeaveType) {
          $('#add_leavetype').modal('hide');
          this.toastr.success('Leave type is added', 'Success');
          this.getLeaveTypes();
        }
      }, error => this.toastr.error(error, 'Error'));
  }
  // Edit Provident Modal Api Call

  updateLeavetype(f) {

    this.updateLeaveTypeGQL
      .mutate({
        id: f.value._id,
        leavetype: f.value.leavetype,
        leavedays: f.value.leavedays,
        carryforward: f.value.carryforward,
        carrymax: f.value.carrymax,
        status: f.value.status,
        modified: {
          modified_by: JSON.parse(sessionStorage.getItem('user')).username,
          modified_at: Date.now()
        }
      })
      .subscribe((val: any) => {
        if (val.data.updateLeaveType) {
          $('#edit_leavetype').modal('hide');
          this.toastr.success('Leave type is edited', 'Success');
          this.getLeaveTypes();
        }
      }, error => this.toastr.error(error, 'Error')
      );
  }

  onCarryChange(form) {
    const carryInput = form.controls['carryforward'] as FormControl;
    const maxCarryInput = form.controls['carrymax'] as FormControl;
    if (carryInput.value === 'Yes') {
      maxCarryInput.setValidators([Validators.required]);
    } else {
      maxCarryInput.clearValidators();
    }
    maxCarryInput.updateValueAndValidity();
    this.cdRef.detectChanges();
  }

  addReset() {
    this.addForm.reset();
  }

  edit(value) {
    this.uptForm.reset();
    this.editId = value;
    const index = this.allLeaveType.findIndex((item) => item._id === value);
    const toSetValues = this.allLeaveType[index];
    this.uptForm.patchValue(toSetValues);
  }

  // Delete Provident Modal Api Call

deleteLeave() {

  this.deleteLeaveTypeGQL
    .mutate({
      id: this.tempId,
      modified: {
        modified_by: JSON.parse(sessionStorage.getItem('user')).username,
        modified_at: Date.now()
      }
    })
    .subscribe( (val: any) => {
      if (val.data.deleteLeaveType) {
        $('#delete_leavetype').modal('hide');
        this.toastr.success('Leave type is deleted', 'Success');
        this.getLeaveTypes();
      }
    }, error =>
      this.toastr.error(error, 'Error')
    );
}
  // for unsubscribe datatable
ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }
}
