import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateUpdateSysParametersGQL, GET_SYSPARAMETERS_QUERY } from './themesetting-gql.service';
import { GET_ROLES_QUERY } from '../role/rolesetting-gql.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSettingsComponent implements OnInit {

  public themeSettings: FormGroup;
  public allSysParams: any;
  websitename: string;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private apollo: Apollo,
    private createUpdateSysGQL: CreateUpdateSysParametersGQL
  ) {}

  ngOnInit() {
    this.themeSettings = this.formBuilder.group({
      websiteName: ['', [Validators.required]],
      lightLogo: [''],
      favicon: [''],
    });

    this.getAllSysParams();
  }

  getAllSysParams() {
    this.apollo.watchQuery({
      query: GET_SYSPARAMETERS_QUERY,
      variables: {
        query: {
          limit: 100
        }
      },
    }).valueChanges.pipe(
      map((val: any) => val.data.getSysparameters[0].sysparams)
    ).subscribe((response: any) => {
      if (response) {
        this.allSysParams = response;
        this.websitename = _.filter(this.allSysParams, val => val.sysparaname === 'websiteName')[0].sysparavalue;
        this.themeSettings.get('websiteName').patchValue(this.websitename);
        this.cdRef.detectChanges();
      }
    }, error => this.toastr.error(error, 'Error'));
  }

  submitThemeSettings(form) {
    if (this.themeSettings.valid) {
      this.createUpdateSysGQL.mutate({
        sysparams: {
          sysparaname: 'websiteName',
          sysparavalue: form.value.websiteName,
          created_at: Date.now(),
          created_by: JSON.parse(sessionStorage.getItem('user')).username
        }
      }).subscribe((response: any) => {
        if (response.data.createOrUpdateSysparameters) {
          this.toastr.success('System parameters has been Added', 'Success');
          this.cdRef.detectChanges();
        }
      }, error => this.toastr.error(error, 'Error'));
    }
  }
}
