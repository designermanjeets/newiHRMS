import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from './header.service';
import { GET_SYSPARAMETERS_QUERY } from '../all-modules/settings/theme-settings/themesetting-gql.service';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import * as _ from 'lodash';

declare const $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  jsonData: any = {
    notification: [],
    message: [],
  };
  notifications: any;
  messagesData: any;
  currUser: any;
  currWebName: string;
  allSysParams: any;

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    // this.getDatas("notification");
    // this.getDatas("message");

    this.notifications = [
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '4 mins ago',
      },
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '1 hour ago',
      },
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '4 mins ago',
      },
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '1 hour ago',
      },
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '4 mins ago',
      },
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '1 hour ago',
      },
    ];

    this.messagesData = [
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '4 mins ago',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '1 hour ago',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '4 mins ago',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '1 hour ago',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '4 mins ago',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '1 hour ago',
      },
    ];

    this.getAllSysParams();

    this.currUser = JSON.parse(sessionStorage.getItem('user'));

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
      map((val: any) => val.data.getSysparameters[0] && val.data.getSysparameters[0].sysparams)
    ).subscribe((response: any) => {
      if (response) {
        this.allSysParams = response;
        this.currWebName = _.filter(this.allSysParams, val => val.sysparaname === 'websiteName')[0].sysparavalue;
      }
    });
  }

  getDatas(section) {
    this.headerService.getDataFromJson(section).subscribe((data) => {
      this.jsonData[section] = data;
    });
  }

  clearData(section) {
    this.jsonData[section] = [];
  }
  onSubmit() {
    this.router.navigate(['/pages/search']);
  }
}
