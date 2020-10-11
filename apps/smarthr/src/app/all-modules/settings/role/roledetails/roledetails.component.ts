import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { SetGetRolesService } from '../rolesetting-gql.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-roledetails',
  templateUrl: './roledetails.component.html',
  styleUrls: ['./roledetails.component.css'],
})

export class RoledetailsComponent implements OnInit, OnDestroy {

  roleID: string;
  roledetailForm: FormGroup;
  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apollo: Apollo,
    private toastr: ToastrService,
    private setgetRoleService: SetGetRolesService
  ) {
  }

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe(val => {
      if (val) {
        this.roleID = val.id;
      }
    });

    this.initForm();

    this.sub = this.setgetRoleService.getRoleDetail.subscribe(val => {
      if (val) {
        this.roledetailForm.patchValue(val);
      }
    });

  }

  initForm() {
    this.roledetailForm = this.fb.group({
      _id: [''],
      mod_employee: [false],
      mod_holidays: [false],
      mod_leaves: [false],
      mod_events: [false],
      mod_jobs: [false],
      mod_assets: [false],
      permissions: this.fb.group({
        employees: this.fb.group({
          read: [false],
          write: [false],
          create: [false],
          delete: [false],
          import: [false],
          export: [false]
        }),
        holidays: this.fb.group({
          read: [false],
          write: [false],
          create: [false],
          delete: [false],
          import: [false],
          export: [false]
        }),
        leaves: this.fb.group({
          read: [false],
          write: [false],
          create: [false],
          delete: [false],
          import: [false],
          export: [false]
        }),
        events: this.fb.group({
          read: [false],
          write: [false],
          create: [false],
          delete: [false],
          import: [false],
          export: [false]
        }),
        jobs: this.fb.group({
          read: [false],
          write: [false],
          create: [false],
          delete: [false],
          import: [false],
          export: [false]
        }),
        assets: this.fb.group({
          read: [false],
          write: [false],
          create: [false],
          delete: [false],
          import: [false],
          export: [false]
        }),
      }),
    });
  }

  manageRole(form) {
    form.value._id = this.roleID;
    console.log(form.value);
    this.setgetRoleService.setRolesValue(form.value);
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

}
