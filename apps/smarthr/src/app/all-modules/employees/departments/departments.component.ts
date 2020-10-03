import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreateDepartmentGQL,
  DeleteDepartmentGQL,
  GET_DEPARTMENTS_QUERY,
  SetGetDepartmentsService,
  UpdateDepartmentGQL
} from './department-gql.service';
import { UpdateDesignationGQL } from '../designation/designation-gql.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
declare const $: any;

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentsComponent implements OnInit, OnDestroy {
  public lstDepartment: any[];
  public url: any = 'departments';
  public tempId: any;
  public editId: any;

  public srch = [];

  rows = [];
  selected = [];
  columns: any[] = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  editForm: FormGroup;
  actionParams: any;

  public uptD = [];

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apollo: Apollo,
    private createDepartmentGQL: CreateDepartmentGQL,
    private updateDepartmentsGQL: UpdateDepartmentGQL,
    private deleteDesignationGQL: DeleteDepartmentGQL,
    private setGetDepartmentsService: SetGetDepartmentsService,
    private updateDesignationGQL: UpdateDesignationGQL,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.editForm = this.fb.group({
      _id: [''],
      department: ['', Validators.required]
    });

    this.LoadDepartment();
  }

  // Get department list  Api Call
  LoadDepartment() {

    this.apollo.watchQuery({
      query: GET_DEPARTMENTS_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data) {
        this.rows = [];
        this.lstDepartment = response.data.getDepartments;
        this.rows = response.data.getDepartments;
        this.srch = [...this.rows];
        this.setGetDepartmentsService.setDepartments(response.data.getDepartments);
        this.cdRef.detectChanges();
      }
    }, error => this.toastr.error(error, 'Error'));
  }

  // Add Department  Modal Api Call
  addDepartment(f) {

    this.createDepartmentGQL
      .mutate({
        department: f.value.department,
        created_at: Date.now(),
      })
      .subscribe( (val: any) => {
        if (val.data) {
          $('#add_department').modal('hide');
          this.toastr.success('Department added sucessfully...!', 'Success');
          this.LoadDepartment();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  editDepartment(f) {

    this.updateDepartmentsGQL
      .mutate({
        id: f.value._id,
        department: f.value.department,
        modified: {
          modified_at: Date.now(),
          modified_by: JSON.parse(sessionStorage.getItem('user')).username
        }
      })
      .subscribe( (val: any) => {
        if (val.data) {
          $('#edit_department').modal('hide');
          this.toastr.success('Department Updated sucessfully...!', 'Success');
          this.LoadDepartment();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  // To Get The department Edit Id And Set Values To Edit Modal Form

  addReset() {
    this.editForm.reset();
  }

  edit(value) {
    this.editForm.reset();
    this.editId = value;
    const index = this.lstDepartment.findIndex((item) => {
      return item._id === value;
    });
    const toSetValues = this.lstDepartment[index];
    console.log(toSetValues);
    this.editForm.patchValue(toSetValues);
  }

  deleteDepartment() {

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
          $('#delete_department').modal('hide');
          this.toastr.success('Department deleted sucessfully..!', 'Success');
          this.cdRef.detectChanges();
          this.LoadDepartment();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }
}
