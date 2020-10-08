import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-roledetails',
  templateUrl: './roledetails.component.html',
  styleUrls: ['./roledetails.component.css']
})

export class RoledetailsComponent implements OnInit {

  roleID: string;
  roledetailForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.roleID = params.id;
    });

    this.initForm();
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
    console.log(form.value);
  }

}
