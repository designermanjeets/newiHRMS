import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreateDesignationGQL,
  DeleteDesignationGQL,
  GET_DESIGNATIONS_QUERY,
  SetGetDesignationsService,
  UpdateDesignationGQL
} from './designation-gql.service';

declare const $: any;
import * as _ from 'lodash';
import { GET_DEPARTMENTS_QUERY } from '../departments/department-gql.service';
import { GET_LEAVETYPES_QUERY } from '../../settings/leave-type/leave-types-gql.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignationComponent implements OnInit, OnDestroy {
  lstDesignation: any[];
  url: any = 'designation';
  public tempId: any;
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
    private createDesignationGQL: CreateDesignationGQL,
    private deleteDesignationGQL: DeleteDesignationGQL,
    private updateDesignationGQL: UpdateDesignationGQL,
    private setGetDesignationsService: SetGetDesignationsService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.LoadDesignation();
  }

  initForm() {
    this.editForm = this.fb.group({
      _id: [''],
      designation: ['', Validators.required],
      departmentID: ['', Validators.required],
      leaveType: this.fb.array([])
    });
  }


  leaveType(): FormArray {
    return this.editForm && this.editForm.get('leaveType') as FormArray;
  }

  newLeavetypes(val): FormGroup {
    return this.editForm && this.fb.group({
      leaveID: val._id,
      checked: val.checked,
      leaveType: val.leaveType,
    });
  }

  addLeavetypes(val) {
    if (this.editForm) {
      this.leaveType().push(this.newLeavetypes(val));
    }
  }

  removeLeavetypes(i: number) {
    if (this.editForm) {
      this.leaveType().removeAt(i);
    }
  }

  getAllLeaveTypes() {
    this.apollo.watchQuery({
      query: GET_LEAVETYPES_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      }
    }).valueChanges.subscribe((response: any) => {
      if (response.data.getLeaveTypes) {
        this.allLeaveTypes = response.data.getLeaveTypes;
        _.forEach(this.allLeaveTypes, val => delete val['checked']); // Cache Issue
        _.forEach(this.allLeaveTypes, val => this.addLeavetypes(val));
      }
      this.cdRef.detectChanges();
    }, error => this.toastr.error(error, 'Error'));
  }

  // Get designation list  Api Call
  LoadDesignation() {

    this.apollo.watchQuery({
      query: GET_DESIGNATIONS_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      }
    }).valueChanges.subscribe((response: any) => {
      if (response.data) {
        this.rows = [];
        this.lstDesignation = response.data.getDesignations;
        this.rows = this.lstDesignation;
        this.srch = [...this.rows];
        this.initForm();

        this.setGetDesignationsService.setDesignations(response.data.getDesignations);
        this.getDepartments();
        this.getAllLeaveTypes();
        this.cdRef.detectChanges();
      }
    });

  }

  // Add Designation  Modal Api Call
  addDesignation(f) {

    const newFormObj = JSON.parse(JSON.stringify(f.value));
    newFormObj.leaveType = _.filter(newFormObj.leaveType, { checked: true });
    newFormObj.leaveType = _.forEach(newFormObj.leaveType, (d) => {
      delete d.checked;
    });

    const mapped = _.map(newFormObj.leaveType, _.partialRight(_.pick, ['leaveID']));
    const lTypes = []; _.each(mapped, val =>  lTypes.push(val.leaveID));

    this.createDesignationGQL
      .mutate({
        designation: f.value.designation,
        departmentID: f.value.departmentID,
        created_at: Date.now(),
        leaveType: lTypes
      })
      .subscribe((val: any) => {
        if (val.data) {
          $('#add_designation').modal('hide');
          this.toastr.success('Designation added successfully...!', 'Success');
          this.LoadDesignation();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  editDesignation(f) {

    const newFormObj = JSON.parse(JSON.stringify(f.value));

    newFormObj.leaveType = _.filter(newFormObj.leaveType, { checked: true });
    newFormObj.leaveType = _.forEach(newFormObj.leaveType, (d) => {
      delete d.checked;
    });

    const mapped = _.map(newFormObj.leaveType, _.partialRight(_.pick, ['leaveID']));
    const lTypes = []; _.each(mapped, val =>  lTypes.push(val.leaveID));

    this.updateDesignationGQL
      .mutate({
        id: f.value._id,
        designation: newFormObj.designation,
        departmentID: f.value.departmentID,
        modified: {
          modified_at: Date.now(),
          modified_by: JSON.parse(sessionStorage.getItem('user')).username
        },
        leaveType: lTypes
      })
      .subscribe((val: any) => {
        if (val.data) {
          $('#edit_designation').modal('hide');
          this.toastr.success('Department Updated successfully...!', 'Success');
          this.LoadDesignation();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  getDepartments() {
    this.apollo.watchQuery({
      query: GET_DEPARTMENTS_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      }
    }).valueChanges.subscribe((response: any) => {
      if (response.data) {
        this.departments = response.data.getDepartments;
        this.setGetDesignationsService.setDepartments(this.departments);
      }
    }, error => this.toastr.error(error, 'Error'));
  }

  addModel() {
    this.isAddModel = true;
    this.isEditModel = false;
    this.initForm();
    this.getAllLeaveTypes();
    this.editForm.reset();
  }

  // To Get The timesheet Edit Id And Set Values To Edit Modal Form
  edit(value) {

    let toSetValues: any = [];
    const frmArray = this.editForm.get('leaveType') as FormArray;
    frmArray.clear();

    this.isEditModel = true;
    this.isAddModel = false;
    this.editForm.reset();
    this.editId = value;

    const index = this.lstDesignation.findIndex((item) => {
      return item._id === value;
    });

    toSetValues = this.lstDesignation[index];
    const leaveTypeArr = []; _.each(toSetValues.leaveType, val => leaveTypeArr.push({leaveID: val}));
    _.forEach(this.allLeaveTypes, (d) => delete d.checked);

    _.forEach(this.allLeaveTypes, alll => {
      _.each(leaveTypeArr, ltarr => {
        if (alll._id === ltarr.leaveID) {
          alll['checked'] = true;
        }
      });
    });

    _.forEach(this.allLeaveTypes, val => this.addLeavetypes(val)); // Generate All Checkboxes


    this.editForm.patchValue({
      departmentID: toSetValues.departmentID,
      designation: toSetValues.designation,
      _id: toSetValues._id
    });
  }

  getCheckedLeaves(toSetValues) {
    console.log(toSetValues.leaveType);
    console.log(this.allLeaveTypes);
    const allls = JSON.parse(JSON.stringify(this.allLeaveTypes));
    _.forEach(toSetValues.leaveType, up => {
      _.forEach(allls, val => {
        if (up.leavechecked) {
          if (val._id === up.leaveID) {
            val['leavechecked'] = true;
          }
        }
      });
    });

    _.forEach(this.allLeaveTypes, val => this.addLeavetypes(val));
  }

  // Delete timedsheet Modal Api Call

  deleteDesignation(id?) {

    this.deleteDesignationGQL
      .mutate({
        id: this.tempId,
        modified: {
          modified_by: JSON.parse(sessionStorage.getItem('user')).username,
          modified_at: Date.now()
        }
      })
      .subscribe((val: any) => {
        if (val.data) {
          $('#delete_designation').modal('hide');
          this.toastr.success('Designation deleted sucessfully..!', 'Success');
          this.LoadDesignation();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }
}
