import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class RegisterLeaveGQL extends Mutation {
  document = gql`
    mutation createLeave (
      $user_ID: String
      $leavetype: String!
      $leave_ID: String!
      $from: ISODate
      $to: ISODate
      $nofdays: String
      $remaingleaves: String
      $reason: String
      $created_at: ISODate
      $created_by: String
    ) {
      createLeave(
        user_ID: $user_ID
        leavetype: $leavetype
        leave_ID: $leave_ID
        from: $from
        to: $to
        nofdays: $nofdays
        remaingleaves: $remaingleaves
        reason: $reason
        created_at: $created_at
        created_by: $created_by
      ) {
          user_ID
          leavetype
          leave_ID
          from
          to
          nofdays
          remaingleaves
          reason
          created_at
          created_by
      }
    }
  `;
}

export const GET_USERLEAVES_QUERY = gql`
   query getUserLeaves(
      $pagination: Pagination!
    ) {
    getLeavesApplied(
      query: $pagination,
    ) {
        _id
        leave_ID
        leavetype
        user_ID
        from
        to
        nofdays
        reason
        status
        approver
      }
  }
`;
