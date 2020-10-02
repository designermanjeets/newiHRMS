import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ChangePasswordGQL } from './changepassword-gql.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changeForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private changePasswordGQL: ChangePasswordGQL,
    private router: Router
  ) { }


  ngOnInit() {
    this.changeForm = this.fb.group({
        oldpassword: ['', Validators.required],
        newpassword: ['', Validators.required],
        confirmpassword: ['', Validators.required]
      },
      { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.newpassword.value;
    const confirmPass = group.controls.confirmpassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  changePasswordSubmit(f) {
    this.changePasswordGQL
      .mutate({
        id: JSON.parse(sessionStorage.getItem('user')).userid,
        oldPassword: f.value.oldpassword,
        newPassword: f.value.newpassword,
        email: JSON.parse(sessionStorage.getItem('user')).email,
      })
      .subscribe( (val: any) => {
        if (val.data.changePassword) {
          this.toastr.success('Password Changed Success!', 'Success');
          this.router.navigateByUrl('./pages/login');
          sessionStorage.setItem('resetpwd', 'true');
        }
      }, error =>
        this.toastr.success(error, 'Error')
      );
  }

}
