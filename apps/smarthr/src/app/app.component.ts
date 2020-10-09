import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationStart } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { Role, User } from './_helpers/_models/user';
import { AuthenticationService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MsSmartHRMS';
  user: User;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
  ) {

    if (!sessionStorage.getItem(('JWT_TOKEN'))) {
      this.router.navigateByUrl('./pages/login');
    } else {
      this.authenticationService.user.subscribe(x => {
        this.user = x;
        console.log(x);
      });
    }

    if (sessionStorage.getItem(('JWT_TOKEN')) && sessionStorage.getItem('sessionExpire')) {
      this.toastr.error('Your Session Expired, please login again.', 'Error');
      setTimeout(_ => {
        sessionStorage.removeItem('sessionExpire');
        this.router.navigateByUrl('./pages/login');
      }, 2000);
    }
  }

  ngOnInit() {

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // this.url = event.url.split('/')[1];
        // this.url2 = event.url.split('/')[2];
      }
    });

    // Minified Sidebar

    $(document).on('click', '#toggle_btn', () => {
      if ($('body').hasClass('mini-sidebar')) {
        $('body').removeClass('mini-sidebar');
        $('.subdrop + ul').slideDown();
      } else {
        $('body').addClass('mini-sidebar');
        $('.subdrop + ul').slideUp();
      }
      return false;
    });

    $(document).on('mouseover', (e) => {
      e.stopPropagation();
      if ($('body').hasClass('mini-sidebar') && $('#toggle_btn').is(':visible')) {
        const targ = $(e.target).closest('.sidebar').length;
        if (targ) {
          $('body').addClass('expand-menu');
          $('.subdrop + ul').slideDown();
        } else {
          $('body').removeClass('expand-menu');
          $('.subdrop + ul').slideUp();
        }
        return false;
      }
    });
  }

  get isAdmin() {
    return this.user && this.user.role === Role.ADMIN;
  }

}
