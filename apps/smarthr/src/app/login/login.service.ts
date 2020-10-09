import {Injectable} from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_helpers/_models/user';

@Injectable({
  providedIn: 'root',
})
export class RegisterGQL extends Mutation {
  document = gql`
    mutation SignUpMutation(
      $username: String!
      $email: String!
      $password: String!
      $role: String
      $firstname: String
      $lastname: String
      $emmpid: String
      $corporateid: String
      $Role: RoleInput
    ) {
    signup(
        username: $username,
        email: $email,
        password: $password,
        role: $role,
        firstname: $firstname
        lastname: $lastname,
        emmpid: $emmpid,
        corporateid: $corporateid,
        Role: $Role,
    ) {
        username,
        email,
        password,
        role,
        firstname,
        lastname,
        emmpid,
        corporateid
      }
  }
  `;
}


@Injectable({
  providedIn: 'root',
})
export class LoginGQL extends Mutation {
  document = gql`
    mutation SigninMutation($email: String!, $password: String!) {
      login(
        email: $email
        password: $password
      ) {
        user {
          email
          emmpid
          role,
          username
          corporateid
          _id
        },
        token
      }
    }
  `;
}


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  setLogin(user) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    this.userSubject.next(user);
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
