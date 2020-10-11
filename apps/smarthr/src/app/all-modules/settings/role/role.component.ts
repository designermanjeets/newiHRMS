import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateRoleGQL, DeleteRoleGQL, GET_ROLES_QUERY, SetGetRolesService, UpdateRoleGQL } from './rolesetting-gql.service';
import { Apollo } from 'apollo-angular';
import * as _ from 'lodash';
import { Route, Router } from '@angular/router';

declare const $: any;
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RoleComponent implements OnInit {
  public url: any = 'roles';
  public allroles: any = [];
  public addRoles: FormGroup;
  public editRoles: FormGroup;
  public editId: any;
  public tempId: any;
  selectedIndex = 0;

  constructor(
    private allModuleService: AllModulesService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private apollo: Apollo,
    private createRoleGQL: CreateRoleGQL,
    private updateRoleGQL: UpdateRoleGQL,
    private deleteRoleGQL: DeleteRoleGQL,
    private setGetRoleService: SetGetRolesService,
    private route: Router
  ) {}

  ngOnInit() {
    this.getAllRoles();

    // Add Role Form Validation And Getting Values

    this.addRoles = this.formBuilder.group({
      addRoleName: ['', [Validators.required]],
    });

    // Edit Role Form Validation And Getting Values

    this.editRoles = this.formBuilder.group({
      editRoleName: ['', [Validators.required]],
    });

    this.setGetRoleService.getRole.subscribe(value => {
      if (value) {
        this.updateRolesSubmit(value);
      }
    });
  }

  getAllRoles() {
    this.apollo.watchQuery({
      query: GET_ROLES_QUERY,
      variables: {
        query: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data.getRoles) {
        this.allroles = response.data.getRoles;

        this.route.navigate(['/settings/role/roledetails'], { queryParams: { id: this.allroles[0]._id } });
        this.setForDetail(this.allroles[0], 0);
        this.cdRef.detectChanges();
      }
    }, error => this.toastr.error(error, 'Error'));
  }

  addRolesSubmit(form) {
    this.createRoleGQL
      .mutate({
        role_name: form.value.addRoleName,
        created_at: Date.now(),
        created_by: JSON.parse(sessionStorage.getItem('user')).username
      }).subscribe((response: any) => {
      if (response.data.createRole) {
        this.getAllRoles();
        $('#add_role').modal('hide');
        this.addRoles.reset();
        this.toastr.success('Role has been Created', 'Success');
        this.cdRef.detectChanges();
      }
    }, error => this.toastr.error(error, 'Error'));

  }

  setForDetail(roles, i) {
    this.setGetRoleService.setRolesForDetail(roles);
    this.selectedIndex = i;
  }

  updateRolesSubmit(form) {

    const rol = _.filter(this.allroles, v => v._id === form._id);

    this.updateRoleGQL
      .mutate({
        id: rol[0]._id,
        role_name: rol[0].role_name,
        mod_employee: form.mod_employee,
        mod_holidays: form.mod_holidays,
        mod_leaves: form.mod_leaves,
        mod_events: form.mod_events,
        mod_jobs: form.mod_jobs,
        mod_assets: form.mod_assets,
        permissions: form.permissions,
        modified: {
          modified_at: Date.now(),
          modified_by: JSON.parse(sessionStorage.getItem('user')).username
        }
    }).subscribe((response: any) => {
      if (response.data.updateRole) {
        this.getAllRoles();
        this.toastr.success('Role has been updated', 'Success');
        this.cdRef.detectChanges();
      }
    }, error => this.toastr.error(error, 'Error'));
  }

  // Edit Provident Modal Api Call

  editRolesSubmit(form) {

    this.updateRoleGQL
      .mutate({
        id: this.editId._id,
        role_name: form.value.editRoleName,
        modified: {
          modified_at: Date.now(),
          modified_by: JSON.parse(sessionStorage.getItem('user')).username
        }
      }).subscribe((response: any) => {
      if (response.data.updateRole) {
        this.getAllRoles();
        $('#edit_role').modal('hide');
        this.editRoles.reset();
        this.editId = null;
        this.toastr.success('Role Name has been Updated', 'Success');
        this.cdRef.detectChanges();
      }
    }, error => this.toastr.error(error, 'Error'));
  }

  edit(value) {
    this.editId = value;
    this.editRoles.setValue({
      editRoleName: value.role_name,
    });
  }

  // Delete Provident Modal Api Call

  deleteRoles() {

    console.log(this.tempId);

    this.deleteRoleGQL
      .mutate({
        id: this.tempId._id,
        role_name: this.tempId.role_name,
        modified: {
          modified_at: Date.now(),
          modified_by: JSON.parse(sessionStorage.getItem('user')).username
        }
      }).subscribe((response: any) => {
      if (response.data.deleteRole) {
        this.getAllRoles();
        $('#delete_role').modal('hide');
        this.tempId = null;
        this.toastr.success('Role has been Deleted', 'Success');
        this.cdRef.detectChanges();
      }
    }, error => this.toastr.error(error, 'Error'));
  }
}
