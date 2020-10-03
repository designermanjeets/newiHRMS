import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { AllModulesService } from '../../../all-modules.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

import {
  CreateUserGQL,
  DeleteUserGQL,
  EmpdetailGQLService,
  EmployeeGQLService, GET_COMPANIES_QUERY,
  GET_USERS_QUERY,
  ImportUsersGQL
} from '../employee-gql.service';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GET_DESIGNATIONS_QUERY, SetGetDesignationsService } from '../../designation/designation-gql.service';
import { GET_DEPARTMENTS_QUERY } from '../../departments/department-gql.service';
import { UploadFileGQL } from './uploadgql.service';
import { UploadOutput, UploadInput, UploadFile, UploaderOptions } from 'ngx-uploader';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

declare const $: any;
import * as moment from 'moment';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit, OnDestroy, AfterViewInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public lstEmployee: any;
  public url: any = 'employeelist';
  public tempId: any;
  public editId: any;


  public pipe = new DatePipe('en-US');
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public DateJoin;
  deleteparams: any;

  options: UploaderOptions;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  fileToUpload: File = null;

  uptEmployeeValidation = false;
  editForm: FormGroup;
  companies: [];
  departments: any;
  designations: any;
  allDesignations: any;
  isModal: boolean;
  actionParams: any;

  rows = [];
  selected = [];
  columns: any[] = [
    { prop: 'username', name: 'Username' },
    { prop: 'email', name: 'Email' },
    { prop: 'emmpid', name: 'Emp ID' },
    { prop: 'firstname', name: 'First Name' },
    { prop: 'lastname', name: 'Last Name' },
    { prop: 'joiningdate', name: 'Joining Date' },
    { prop: 'role', name: 'Role' },
    { prop: 'department', name: 'Department' },
    { prop: 'designation.designation', name: 'Designation' }
    ];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private fb: FormBuilder,

    private router: Router,
    private apollo: Apollo,
    private employeeGQLService: EmployeeGQLService,
    private createUserGQL: CreateUserGQL,
    private cdref: ChangeDetectorRef,
    private deleteUserGQL: DeleteUserGQL,
    private activeRoute: ActivatedRoute,
    private importUsersGQL: ImportUsersGQL,
    private empdetailGQLService: EmpdetailGQLService,
    private setGetDesignationsService: SetGetDesignationsService,
    private uploadFileGQL: UploadFileGQL
  ) {
    this.options = { concurrency: 1, maxUploads: 3, maxFileSize: 1000000 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
  }

  ngOnInit() {

    this.getUsers();
    this.getCompanies();
    this.getDepartments();

    // for floating label

    $('.floating')
      .on('focus blur', function(e) {
        $(this)
          .parents('.form-focus')
          .toggleClass('focused', e.type === 'focus' || this.value.length > 0);
      })
      .trigger('blur');
    this.getUsers();
    // add employee form validation

    this.editForm = this.fb.group({
      _id: [''],
      firstname: [''],
      lastname: [''],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      emmpid: ['', Validators.required],
      joiningdate: ['', Validators.required],
      corporateid: ['', Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      mobile: [''],
      permissions: this.fb.group({
        holiday: this.fb.group({
          read: [],
          write: [],
          create: [],
          delete: [],
          import: [],
          export: []
        }),
        leave: this.fb.group({
          read: [],
          write: [],
          create: [],
          delete: [],
          import: [],
          export: []
        }),
        assets: this.fb.group({
          read: [],
          write: [],
          create: [],
          delete: [],
          import: [],
          export: []
        }),
      }),
    }, { validator: this.checkPasswords });

    // edit form validation
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.dtTrigger.next(), 1000);
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.password.value;
    const confirmPass = group.controls.password2.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  createSubmit(f) {
    const data = f.value;
    const dprt = this.setGetDesignationsService.getDepartment(f.value.department);
    const desig = this.setGetDesignationsService.getDesignations(f.value.designation);
    this.createUserGQL
      .mutate({
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        emmpid: data.emmpid,
        corporateid: data.corporateid,
        joiningdate: data.joiningdate,
        department: dprt.department,
        department_ID: dprt._id,
        designation: {
          designation: desig.designation
        },
        designation_ID: desig._id,
        mobile: data.mobile,
        permissions: {
          holiday: {
            read: data.permissions && data.permissions.holiday.read,
            write: data.permissions && data.permissions.holiday.write,
            create: data.permissions && data.permissions.holiday.create,
            delete: data.permissions && data.permissions.holiday.delete,
            import: data.permissions && data.permissions.holiday.import,
            export: data.permissions && data.permissions.holiday.export
          },
          leave: {
            read: data.permissions && data.permissions.leave.read,
            write: data.permissions && data.permissions.leave.write,
            create: data.permissions && data.permissions.leave.create,
            delete: data.permissions && data.permissions.leave.delete,
            import: data.permissions && data.permissions.leave.import,
            export: data.permissions && data.permissions.leave.export
          },
          assets: {
            read: data.permissions && data.permissions.assets.read,
            write: data.permissions && data.permissions.assets.write,
            create: data.permissions && data.permissions.assets.create,
            delete: data.permissions && data.permissions.assets.delete,
            import: data.permissions && data.permissions.assets.import,
            export: data.permissions && data.permissions.assets.export
          }
        },
        modified : []
      })
      .subscribe( (val: any) => {
        if (val.data.signup.username) {
          $('#add_employee').modal('hide');
          this.toastr.success('Employeee added sucessfully...!', 'Success');
          this.getUsers();
        }
      }, error => console.log(error));
  }

  updateSubmit(f) {
    const dprt = this.setGetDesignationsService.getDepartment(f.value.department);
    const desig = this.setGetDesignationsService.getDesignations(f.value.designation);
    this.empdetailGQLService
      .mutate({
        id: f.value._id,
        username: f.value.username,
        email: f.value.email,
        password: f.value.password,
        role: f.value.role,
        department: dprt.department,
        department_ID: dprt._id,
        designation: {
          designation: desig.designation
        },
        designation_ID: desig._id,
        emmpid: f.value.emmpid,
        corporateid: f.value.corporateid,
        firstname: f.value.firstname,
        lastname: f.value.lastname,
        joiningdate: f.value.joiningdate,
        mobile: f.value.mobile,
        permissions: {
          holiday: {
            read: f.value.permissions && f.value.permissions.holiday.read,
            write: f.value.permissions && f.value.permissions.holiday.write,
            create: f.value.permissions && f.value.permissions.holiday.create,
            delete: f.value.permissions && f.value.permissions.holiday.delete,
            import: f.value.permissions && f.value.permissions.holiday.import,
            export: f.value.permissions && f.value.permissions.holiday.export
          },
          leave: {
            read: f.value.permissions && f.value.permissions.leave.read,
            write: f.value.permissions && f.value.permissions.leave.write,
            create: f.value.permissions && f.value.permissions.leave.create,
            delete: f.value.permissions && f.value.permissions.leave.delete,
            import: f.value.permissions && f.value.permissions.leave.import,
            export: f.value.permissions && f.value.permissions.leave.export
          },
          assets: {
            read: f.value.permissions && f.value.permissions.assets.read,
            write: f.value.permissions && f.value.permissions.assets.write,
            create: f.value.permissions && f.value.permissions.assets.create,
            delete: f.value.permissions && f.value.permissions.assets.delete,
            import: f.value.permissions && f.value.permissions.assets.import,
            export: f.value.permissions && f.value.permissions.assets.export
          }
        },
        modified: {
          modified_by: JSON.parse(sessionStorage.getItem('user')).username,
          modified_at: Date.now()
        }
      })
      .subscribe( (val: any) => {
        if (val.data.updateUser) {
          $('#edit_employee').modal('hide');
          this.toastr.success('Employeee Updated sucessfully...!', 'Success');
          this.getUsers();
          this.cdref.detectChanges();

        }
      }, error => console.log(error));
  }

  getUsers() {
    this.apollo.watchQuery({
      query: GET_USERS_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      this.lstEmployee = response.data.users;
      this.rows = [];
      this.rows = this.lstEmployee;
      this.srch = [...this.rows];
      this.employeeGQLService.setUsers(response.data.users);
      this.cdref.detectChanges();
    });
  }

  getCompanies() {
    this.apollo.watchQuery({
      query: GET_COMPANIES_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      this.companies = response.data.getCompanies;
      this.cdref.detectChanges();

    });
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
        this.getDesignations(); // Don't want to load All beforehand
        this.cdref.detectChanges();
      }
    });
  }

  getDesignations() {
    this.apollo.watchQuery({
      query: GET_DESIGNATIONS_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data) {
        this.allDesignations = response.data.getDesignations;
        this.setGetDesignationsService.setDesignations(this.allDesignations);
        this.editForm.get('designation').disable(); // Will enable on Department basis/selection
        this.cdref.detectChanges();
      }
    });
  }

  onDepartChange(event) {
    this.designations = _.filter(this.allDesignations, person => person.department_ID === event.value);
    this.designations && this.editForm.get('designation').enable();
    this.cdref.detectChanges();
  }

  add() {
    $('#add_employee').modal('show');
    this.editForm.reset();
    const permArr = this.editForm.get('permissions') as FormArray;

    _.forEach(['assets', 'holiday', 'leave'], grp => {
      permArr.get(grp).get('read').patchValue(false);
      permArr.get(grp).get('write').patchValue(false);
      permArr.get(grp).get('create').patchValue(false);
      permArr.get(grp).get('delete').patchValue(false);
      permArr.get(grp).get('import').patchValue(false);
      permArr.get(grp).get('export').patchValue(false);
    });

  }

  // to know the date picker changes
  from(data) {
    this.DateJoin = this.pipe.transform(data, 'dd-MM-yyyy');
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  edit(value) {
    this.editForm.reset();

    const permArr = this.editForm.get('permissions') as FormArray;

    this.editId = value;
    const index = this.lstEmployee.findIndex((item) => {
      return item._id === value._id;
    });
    const toSetValues = this.lstEmployee[index];

    this.editForm.patchValue(value);
    this.editForm.get('password2').patchValue(value.password);
    this.editForm.get('department').patchValue(value.department_ID);
    this.onDepartChange({value: value.department_ID});
    this.editForm.get('designation').patchValue(value.designation._id);
  }

  // delete employee data api call
  deleteEmployee() {
    this.deleteUserGQL
        .mutate({
          email: this.deleteparams.email,
          modified: {
            modified_by: JSON.parse(sessionStorage.getItem('user')).username,
            modified_at: Date.now()
          }
        })
        .subscribe( (val: any) => {
          if (!val.data.deleteUser.email) {
            $('#delete_employee').modal('hide');
            this.toastr.success('Employee deleted sucessfully..!', 'Success', { timeOut: 3000 });
            this.getUsers();
          }
        }, error => console.log(error));
  }

  onImportgetData(rowData) {
    console.log(rowData);
    rowData.forEach((r, i) => {
      if (r.joiningdate instanceof Date && !isNaN(r.joiningdate)) {
        // console.log('valid Date!');
      } else {
        // console.log('Invalid!'); // But Convert First
        r.joiningdate = moment(r.joiningdate, 'DD MM YYYY');
      }
      delete r['__typename'];
    });

    const uniqArrByEmail = _.difference(rowData, _.uniqBy(rowData, 'email'), 'email');
    const uniqArrByEmmp = _.difference(rowData, _.uniqBy(rowData, 'emmpid'), 'emmpid');
    const uniqArrByUsrn = _.difference(rowData, _.uniqBy(rowData, 'username'), 'username');

    if (uniqArrByEmail.length) {
      console.log('Dupicate Emails');
      console.log(uniqArrByEmail);
    }
    if (uniqArrByEmmp.length) {
      console.log('Dupicate Employee IDs');
      console.log(uniqArrByEmmp);
    }
    if (uniqArrByUsrn.length) {
      console.log('Dupicate Employee Usernames');
      console.log(uniqArrByUsrn);
    }
    if (!uniqArrByEmail.length && !uniqArrByEmmp.length && !uniqArrByEmmp.length) {
      console.log('Success');
      this.insertManyUsers(rowData);
    }

  }

  insertManyUsers(data) {
    this.importUsersGQL
      .mutate({
        input: data
      })
      .subscribe( (val: any) => {
        if (val.data.insertManyUsers.users[0].username) {
          this.toastr.success('Data Saved', 'Success', { timeOut: 3000 });
          this.getUsers();
        }
      }, error => {
        this.toastr.error(error, 'Error', { timeOut: 5000 });
      });
  }

  // search by Id
  searchId(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function(d) {
      return d.emmpid && d.emmpid.indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
    this.cdref.detectChanges();
  }

  // search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function(d) {
      val = val.toLowerCase();
      return d.firstname && d.firstname.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
    this.cdref.detectChanges();
  }

  // search by purchase
  searchByDesignation(val) {
    this.rows.splice(0, this.rows.length);
    val = val.toLowerCase();
    const temp = this.srch.filter(function(d) {
      return d.designation && d.designation.designation.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
    this.cdref.detectChanges();
  }

  // getting the status value
  getStatus(data) {
    this.statusValue = data;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // Upload

  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        // if you want to auto upload files when added
        // const event: UploadInput = {
        //   type: 'uploadAll',
        //   url: 'http://localhost:3000/graphql/',
        //   method: 'POST',
        //   data: this.files[0]
        // };
        // this.uploadInput.emit(event);
        this.startUpload();
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'done':
        // The file is downloaded
        break;
    }
  }

  // Manual Upload In case you need it
  startUpload() {
    console.log(this.files[0].nativeFile);
    this.uploadFileGQL
      .mutate({
        file: this.files[0].nativeFile
      })
      .subscribe( (val: any) => {
        if (val.data.uploadFile) {
          console.log(val.data.uploadFile);
          this.onImportgetData(val.data.uploadFile);
        }
      }, error => console.log(error));

  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

}
