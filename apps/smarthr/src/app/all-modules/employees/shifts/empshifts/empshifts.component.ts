import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import {
  CreateShiftGQL,
  DeleteShiftGQL, GET_SHIFTS_QUERY,
  UpdateShiftGQL
} from './empshifts-gql.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
declare const $: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-empshifts',
  templateUrl: './empshifts.component.html',
  styleUrls: ['./empshifts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmpshiftsComponent implements OnInit, OnDestroy {
  lstShift: any[];
  url: any = 'shift';
  public tempShift: any;
  public editId: any;
  public uptD = [];

  public srch = [];

  editForm: FormGroup;
  actionParams: any;
  departments: any;
  allLeaveTypes: any;
  isAddModel = false;
  isEditModel = false;

  rows = [];
  selected = [];
  columns: any[];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private createShiftGQL: CreateShiftGQL,
    private deleteShiftGQL: DeleteShiftGQL,
    private updateShiftGQL: UpdateShiftGQL,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.LoadShift();
  }

  initForm() {
    this.editForm = this.fb.group({
      _id: [''],
      shiftname: ['', Validators.required],
      shiftimeFrom: ['', Validators.required],
      shiftimeTo: ['', Validators.required],
      maxshifts: ['', Validators.required],
    });
  }

  // Get shift list  Api Call
  LoadShift() {

    this.apollo.watchQuery({
      query: GET_SHIFTS_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data) {
        this.rows = [];
        this.lstShift = response.data.getShifts;
        this.rows = this.lstShift;
        this.srch = [...this.rows];
        this.initForm();
        this.cdRef.detectChanges();
      }
    });

  }

  // Add Shift  Modal Api Call
  addShift(f) {
    this.createShiftGQL
      .mutate({
        shiftname: f.value.shiftname,
        shiftimeFrom: f.value.shiftimeFrom,
        shiftimeTo: f.value.shiftimeTo,
        maxshifts: f.value.maxshifts,
        created_at: Date.now(),
        created_by: JSON.parse(sessionStorage.getItem('user')).userid
      })
      .subscribe( (val: any) => {
        if (val.data) {
          $('#add_Shift').modal('hide');
          this.toastr.success('Shift added successfully...!', 'Success');
          this.LoadShift();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  editShift(f) {

    this.updateShiftGQL
      .mutate({
        id: f.value._id,
        shiftname: f.value.shiftname,
        shiftimeFrom: f.value.shiftimeFrom,
        shiftimeTo: f.value.shiftimeTo,
        maxshifts: f.value.maxshifts,
        modified: {
          modified_at: Date.now(),
          modified_by: JSON.parse(sessionStorage.getItem('user')).username
        },
      })
      .subscribe( (val: any) => {
        if (val.data.updateShift) {
          $('#edit_Shift').modal('hide');
          this.toastr.success('Shift Updated successfully...!', 'Success');
          this.LoadShift();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  addModel() {
    this.isAddModel = true;
    this.isEditModel = false;
    this.initForm();
    this.editForm.reset();
  }

  // To Get The timesheet Edit Id And Set Values To Edit Modal Form
  edit(value) {

    this.isEditModel = true;
    this.isAddModel = false;
    this.editForm.reset();
    this.tempShift = value;


    $('#edit_Shift').on('shown.bs.modal', () => {
      this.editForm.patchValue(this.tempShift);
    });
  }

  // Delete Shift Modal Api Call

  deleteShift() {

    this.deleteShiftGQL
      .mutate({
        id: this.tempShift._id,
        shiftname: this.tempShift.shiftname,
        modified: {
          modified_by: JSON.parse(sessionStorage.getItem('user')).username,
          modified_at: Date.now()
        }
      })
      .subscribe( (val: any) => {
        if (val.data) {
          $('#delete_Shift').modal('hide');
          this.toastr.success('Shift deleted successfully..!', 'Success');
          this.LoadShift();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }
}

