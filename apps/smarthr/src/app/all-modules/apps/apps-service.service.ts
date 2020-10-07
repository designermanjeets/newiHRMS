import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppsServiceService {
  constructor(
    private http: HttpClient,
    private route: Router
  ) {}

  getInboxMessages() {
    return this.http.get(`assets/json/inboxmessage.json`);
  }

  logoutUser() {
    this.route.navigateByUrl('/login');
  }
}
