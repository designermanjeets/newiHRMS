import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.css'],
})
export class ThemeSettingsComponent implements OnInit {

  public themeSettings: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.themeSettings = this.formBuilder.group({
      websiteName: ['Demo', [Validators.required]],
      lightLogo: [''],
      favicon: [''],
    });

    this.themeSettings.get('websiteName').patchValue(sessionStorage.getItem('webName') || 'Demo');

  }
  submitThemeSettings() {
    if (this.themeSettings.valid) {
      sessionStorage.setItem('webName', this.themeSettings.value.websiteName);
      this.toastr.success('Theme settings is added', 'Success');
    }
  }
}
