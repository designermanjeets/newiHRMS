import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GET_USERS_QUERY } from '../employee-gql.service';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EmployeeProfileComponent implements OnInit {

  public addEmployeeForm: FormGroup;
  employee: any;
  currDate = Date.now();

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private cdref: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.addEmployeeForm = this.formBuilder.group({
      client: ['', [Validators.required]],
    });

    this.getUsers();
  }

  getUsers() {
    this.apollo.watchQuery({
      query: GET_USERS_QUERY,
      variables: {
        pagination: {
          id: JSON.parse(sessionStorage.getItem('user')).userid
        }
      },
    }).valueChanges.subscribe((response: any) => {
      this.employee = response.data.users[0];
      this.cdref.detectChanges();
    }, error => this.toastr.error(error, 'Error'));
  }


  onSubmit() {
    this.toastr.success('Bank & statutory added', 'Success');
  }
}
