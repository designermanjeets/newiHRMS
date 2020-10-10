import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { GET_USERS_QUERY } from '../dashboard-gql.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDashboardComponent implements OnInit {

  currUser: any;
  currDate = Date.now();

  constructor(
    private apollo: Apollo,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
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
      this.currUser = response.data.users[0];
      this.cdref.detectChanges();
    }, error => this.toastr.error(error, 'Error'));
  }

}
