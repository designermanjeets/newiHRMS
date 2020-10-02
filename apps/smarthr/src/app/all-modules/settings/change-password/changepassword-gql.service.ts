import { Injectable } from '@angular/core';
import {Mutation} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordGQL extends Mutation {
  document = gql`
    mutation updatePassword(
        $id: ID!
        $oldPassword: String!
        $newPassword: String!
        $email: String!
      ) {
      changePassword(
        id: $id,
        oldPassword: $oldPassword,
        newPassword: $newPassword,
        email: $email
      ) {
          user {
            username,
            email
            role
          }
        }
    }
  `;
}
