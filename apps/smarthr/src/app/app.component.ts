import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationStart } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MsSmartHRMS';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

    if (!sessionStorage.getItem(('JWT_TOKEN'))) {
      this.router.navigateByUrl('./pages/login');
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
}
