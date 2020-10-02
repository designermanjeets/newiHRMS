import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AllModulesService } from '../../all-modules.service';
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


@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignationComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  lstDesignation: any[];
  url: any = 'designation';
  public tempId: any;
  public editId: any;
  public uptD:any = [];

  public rows = [];
  public srch = [];

  editForm: FormGroup;
  actionParams: any;
  departments: any;
  allLeaveTypes: any;
  isAddModel = false;
  isEditModel = false;

  constructor(
    private srvModuleService: AllModulesService,
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
  ) {}

  ngOnInit() {
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: 'lrtip',
    };
    this.LoadDesignation();
  }

  initForm() {
    this.editForm = this.fb.group({
      _id: [''],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      leavetype: this.fb.array([]) ,
    });
  }


  leavetype(): FormArray {
    return this.editForm && this.editForm.get('leavetype') as FormArray;
  }

  newLeavetypes(val): FormGroup {
    return this.editForm && this.fb.group({
      leavetype: val.leavetype,
      leave_ID: val._id,
      leavedays: val.leavedays,
      leavechecked: val.leavechecked
    });
  }

  addLeavetypes(val) {
    if (this.editForm) {
      this.leavetype().push(this.newLeavetypes(val));
    }
  }

  removeLeavetypes(i: number) {
    if (this.editForm) {
      this.leavetype().removeAt(i);
    }
  }

  getAllLeaveTypes() {
    this.apollo.query({
      query: GET_LEAVETYPES_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).subscribe((response: any) => {
      if (response.data.getLeaveTypes) {
        this.allLeaveTypes = response.data.getLeaveTypes;
        _.forEach(this.allLeaveTypes, val => delete val['leavechecked']); // Cache Issue
        _.forEach(this.allLeaveTypes, val => this.addLeavetypes(val));
      }
      this.cdRef.detectChanges();
    });
  }

  // Get designation list  Api Call
  LoadDesignation() {

    this.apollo.watchQuery({
      query: GET_DESIGNATIONS_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data) {
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
    newFormObj.leavetype = _.filter(newFormObj.leavetype, {leavechecked: true});
    newFormObj.leavetype = _.forEach(newFormObj.leavetype, (d) => {
      delete d.leavechecked;
    });

    const dprt = this.setGetDesignationsService.getDepartment(f.value.department);
    this.createDesignationGQL
      .mutate({
        designation: f.value.designation,
        department: dprt.department,
        department_ID: dprt._id,
        created_at: Date.now(),
        leavetype: newFormObj.leavetype
      })
      .subscribe( (val: any) => {
        if (val.data) {
          $('#add_designation').modal('hide');
          this.editForm.reset();
          this.toastr.success('Desigantion added sucessfully...!', 'Success');
          window.location.reload();
        }
      }, error => console.log(error));
  }

  editDesignation(f) {

    const newFormObj = JSON.parse(JSON.stringify(f.value));
    newFormObj.leavetype = _.filter(newFormObj.leavetype, {leavechecked: true});
    newFormObj.leavetype = _.forEach(newFormObj.leavetype, (d) => {
      delete d.leavechecked;
    });

    const dprt = this.setGetDesignationsService.getDepartment(f.value.department);
    this.updateDesignationGQL
      .mutate({
        id: f.value._id,
        designation: newFormObj.designation,
        department: dprt.department,
        department_ID: dprt._id,
        modified: {
          modified_at: Date.now(),
          modified_by: JSON.parse(sessionStorage.getItem('user')).username
        },
        leavetype: newFormObj.leavetype
      })
      .subscribe( (val: any) => {
        if (val.data) {
          window.location.reload();
          $('#edit_designation').modal('hide');
          this.toastr.success('Department Updated sucessfully...!', 'Success');
        }
      }, error => console.log(error));
  }

  getDepartments() {
    this.apollo.watchQuery({
      query: GET_DEPARTMENTS_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data) {
        this.departments = response.data.getDepartments;
        this.setGetDesignationsService.setDepartments(this.departments);
      }
    });
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
    const frmArray = this.editForm.get('leavetype') as FormArray;
    frmArray.clear();

    this.isEditModel = true;
    this.isAddModel = false;
    this.editForm.reset();
    this.editId = value;

    const index = this.lstDesignation.findIndex((item) => {
      return item._id === value;
    });

    toSetValues = this.lstDesignation[index];
    _.forEach(toSetValues.leavetype, val => val['leavechecked'] = true);
    this.getCheckedLeaves(toSetValues);

    this.editForm.patchValue({
      department: toSetValues.department_ID,
      designation: toSetValues.designation,
      _id: toSetValues._id
    });
    this.editForm.get('department').patchValue(toSetValues.department_ID);
  }

  getCheckedLeaves(toSetValues) {
      console.log(toSetValues.leavetype);
      console.log(this.allLeaveTypes);
      const allls = JSON.parse(JSON.stringify(this.allLeaveTypes));
      _.forEach(toSetValues.leavetype, up => {
        _.forEach(allls, val => {
          if (up.leavechecked) {
            if (val._id === up.leave_ID) {
              val['leavechecked'] = true;
            }
          }
        });
      });

      _.forEach(allls, val => this.addLeavetypes(val));
  }

  // Delete timedsheet Modal Api Call

  deleteDesignation(id) {

    this.deleteDesignationGQL
      .mutate({
        id: this.tempId,
        modified: {
          modified_by: JSON.parse(sessionStorage.getItem('user')).username,
          modified_at: Date.now()
        }
      })
      .subscribe( (val: any) => {
        if (val.data) {
          $('#delete_designation').modal('hide');
          this.toastr.success('Designation deleted sucessfully..!', 'Success');
          window.location.reload();
        }
      }, error => console.log(error));
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
