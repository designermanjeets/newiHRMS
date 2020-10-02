import {Injectable} from '@angular/core';
import { Mutation, Query } from 'apollo-angular';
import gql from 'graphql-tag';

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
      $permissions: PermissionsInput
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
        permissions: $permissions,
    ) {
        username,
        email,
        password,
        role,
        firstname,
        lastname,
        emmpid,
        corporateid,
        permissions {
          holiday {
            read
            write
          }
        }
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
