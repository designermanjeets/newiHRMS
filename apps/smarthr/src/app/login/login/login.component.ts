import { Component, OnInit } from '@angular/core';

import { LoginGQL, RegisterGQL } from '../login.service';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isloggedin: boolean;
  ispwdreset: boolean;

  constructor(
    private registerGQL: RegisterGQL,
    private loginGQL: LoginGQL,
    private router: Router,
    private fb: FormBuilder
  ) {
    if (sessionStorage.getItem('resetpwd')) {
      this.ispwdreset = true;
      sessionStorage.removeItem('resetpwd');
    }
  }

  ngOnInit() {
    sessionStorage.removeItem('JWT_TOKEN');
    sessionStorage.removeItem('user');

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  register() { // Example but in use currently
    this.registerGQL
      .mutate({
        username: 'manjeet11',
        email: 'manjeet@singh.com',
        password: '123',
        role: 'Admin',
        emmpid: 'EMP1',
        company: 'ABCCOMPANY',
        corporateid: 'default',
        permissions: {
          holiday: {
            read: true,
            write: true
          }
        }
      })
      .subscribe( (val: any) => {
        if (val.data.signup.username) {
          this.isloggedin = true;
          this.router.navigateByUrl('/dashboard');
        }
      }, error => this.isloggedin = false);
  }

  login() {
    console.log(this.loginForm.value);
    this.loginGQL
      .mutate({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      })
      .subscribe( (val: any) => {
        console.log(val);
        if (val.data.login.user) {
          this.isloggedin = true;
          sessionStorage.setItem('JWT_TOKEN', val.data.login.token);
          sessionStorage.setItem('user', JSON.stringify({
            email: val.data.login.user.email,
            role: val.data.login.user.role,
            username: val.data.login.user.username,
            userid: val.data.login.user._id,
            corporateid: val.data.login.user.corporateid
          }));
          this.router.navigateByUrl('/dashboard');
        }
      }, error => this.isloggedin = true);
  }

}
