import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Apollo } from 'apollo-angular';
import { DeleteLeaveTypeGQL, GET_LEAVETYPES_QUERY, RegisterLeaveTypeGQL, UpdateLeaveTypeGQL } from './leave-types-gql.service';

declare const $: any;
@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css'],
})
export class LeaveTypeComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public url: any = 'leaveType';
  public allLeaveType: any = [];
  public editId: any;
  public tempId: any;
  isDtInitialized = false;

  uptForm: FormGroup;
  addForm: FormGroup;
  actionParams: any;

  constructor(
    private allModuleService: AllModulesService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private apollo: Apollo,
    private registerLeaveTypeGQL: RegisterLeaveTypeGQL,
    private updateLeaveTypeGQL: UpdateLeaveTypeGQL,
    private deleteLeaveTypeGQL: DeleteLeaveTypeGQL
  ) {
  }

  ngOnInit() {

    this.getLeaveTypes();

    this.uptForm = this.fb.group({
      _id: [''],
      leavetype: ['', Validators.required],
      leavedays: ['', Validators.required],
      carryforward: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.addForm = this.fb.group({
      _id: [''],
      leavetype: ['', Validators.required],
      leavedays: ['', Validators.required],
      carryforward: ['', Validators.required],
      status: ['', Validators.required]
    });

    // for data table configuration
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: 'lrtip',
    };
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
        this.rerender();
        this.allLeaveType = response.data.getLeaveTypes;
      }
    });
  }

  // Add Provident Modal Api Call

  addLeavetype(f) {
    this.registerLeaveTypeGQL
      .mutate({
        leavetype: f.value.leavetype,
        leavedays: f.value.leavedays,
        carryforward: f.value.carryforward,
        status: f.value.status,
        created_by: JSON.parse(sessionStorage.getItem('user')).username,
        created_at: Date.now(),
      })
      .subscribe((val: any) => {
        if (val.data.createLeaveType) {
          $('#add_leavetype').modal('hide');
          this.addForm.reset();
          this.toastr.success('Leave type is added', 'Success');
          window.location.reload();
        }
      }, error => console.log(error));
  }
  // Edit Provident Modal Api Call

  updateLeavetype(f) {

    this.updateLeaveTypeGQL
      .mutate({
        id: f.value._id,
        leavetype: f.value.leavetype,
        leavedays: f.value.leavedays,
        carryforward: f.value.carryforward,
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
          window.location.reload();
        }
      }, error => console.log(error));
  }

edit(value) {
    console.log(value);
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
        this.getLeaveTypes();
        $('#delete_leavetype').modal('hide');
        this.toastr.success('Leave type is deleted', 'Success');
        window.location.reload();
      }
    }, error => console.log(error));
}
  // for unsubscribe datatable
ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
