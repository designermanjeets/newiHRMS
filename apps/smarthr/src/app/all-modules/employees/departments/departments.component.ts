import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllModulesService } from '../../all-modules.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
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
declare const $: any;

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public lstDepartment: any[];
  public url: any = 'departments';
  public tempId: any;
  public editId: any;

  public rows = [];
  public srch = [];


  editForm: FormGroup;
  actionParams: any;

  public uptD = [];
  isDtInitialized = false;

  constructor(
    private srvModuleService: AllModulesService,
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
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: 'lrtip',
    };

    this.editForm = this.fb.group({
      _id: [''],
      department: ['', Validators.required]
    });

    this.LoadDepartment();
  }

  rerender(): void {
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
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
        this.rerender();
        this.lstDepartment = response.data.getDepartments;
        this.srch = [...this.rows];
        this.setGetDepartmentsService.setDepartments(response.data.getDepartments);
        this.cdRef.detectChanges();
      }
    });
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
          this.LoadDepartment();
          $('#add_department').modal('hide');
          this.editForm.reset();
          this.toastr.success('Department added sucessfully...!', 'Success');
          window.location.reload();
        }
      }, error => console.log(error));
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
          this.router.navigate(['employees/departments']);
          window.location.reload();
        }
      }, error => console.log(error));
  }

  // To Get The department Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.editId = value;
    const index = this.lstDepartment.findIndex((item) => {
      return item._id === value;
    });
    const toSetValues = this.lstDepartment[index];
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
          window.location.reload();
        }
      }, error => console.log(error));
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
