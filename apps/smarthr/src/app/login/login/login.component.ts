import { Component, OnInit } from '@angular/core';

import { AuthenticationService, LoginGQL, RegisterGQL } from '../login.service';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../_helpers/_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isloggedin: boolean;
  ispwdreset: boolean;

  public user: Observable<User>;

  constructor(
    private registerGQL: RegisterGQL,
    private loginGQL: LoginGQL,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
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
      }, error => {
        this.toastr.error(error, 'Error', { timeOut: 3000 });
      });
  }

  login() {
    this.loginGQL
      .mutate({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      })
      .subscribe( (val: any) => {
        if (val.data.login.user) {

          sessionStorage.setItem('JWT_TOKEN', val.data.login.token);
          sessionStorage.setItem('user', JSON.stringify({
            email: val.data.login.user.email,
            role: val.data.login.user.Role.role_name,
            username: val.data.login.user.username,
            userid: val.data.login.user._id,
            emmpid: val.data.login.user.emmpid,
            corporateid: val.data.login.user.corporateid
          }));

          this.authenticationService.setLogin(JSON.parse(sessionStorage.getItem('user')));

          this.toastr.success('Login Success', 'Success', { timeOut: 3000 });
          setTimeout(_ => this.router.navigateByUrl('/dashboard'), 2000);
        }
      }, error => {
        this.toastr.error(error, 'Error', { timeOut: 3000 });
      });
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('user');
    this.authenticationService.setLogin(null);
    this.router.navigate(['/login']);
  }

}
