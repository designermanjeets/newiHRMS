import { Injectable } from '@angular/core';
import { Mutation, Query } from 'apollo-angular';
import gql from 'graphql-tag';
import { AuthenticationService } from '../../../login/login.service';
import { Role } from '../../../_helpers/_models/user';

@Injectable({
  providedIn: 'root',
})
export class RegisterLeaveGQL extends Mutation {
  document = gql`
    mutation createLeave (
      $user_ID: String
      $username: String
      $email: String
      $emmpid: String
      $leavetype: String!
      $leave_ID: String!
      $from: ISODate
      $to: ISODate
      $nofdays: Int
      $remainingleaves: Int
      $reason: String
      $created_at: ISODate
      $created_by: String
    ) {
      createLeave(
        user_ID: $user_ID
        username: $username
        email: $email
        emmpid: $emmpid
        leavetype: $leavetype
        leave_ID: $leave_ID
        from: $from
        to: $to
        nofdays: $nofdays
        remainingleaves: $remainingleaves
        reason: $reason
        created_at: $created_at
        created_by: $created_by
      ) {
          user_ID
          username
          email
          emmpid
          leavetype
          leave_ID
          from
          to
          nofdays
          remainingleaves
          reason
          created_at
          created_by
      }
    }
  `;
}


@Injectable({
  providedIn: 'root',
})
export class UpdateLeaveGQL extends Mutation {
  document = gql`
    mutation updateLeave (
      $id: ID!
      $user_ID: String!
      $username: String
      $email: String
      $emmpid: String
      $leavetype: String!
      $leave_ID: String!
      $from: ISODate
      $to: ISODate
      $nofdays: Int
      $remainingleaves: Int
      $reason: String
      $approvers: [approversInput]
      $approvedBy: approvedByInput
      $rejectedBy: rejectedByInput
      $modified: [modifiedInputs]
      $authorizedBy: authorizedByInput
      $declinedBy: declinedByInput
    ) {
      updateLeave(
        id: $id
        user_ID: $user_ID
        username: $username
        email: $email
        emmpid: $emmpid
        leavetype: $leavetype
        leave_ID: $leave_ID
        from: $from
        to: $to
        nofdays: $nofdays
        remainingleaves: $remainingleaves
        reason: $reason
        approvers: $approvers
        approvedBy: $approvedBy
        rejectedBy: $rejectedBy
        authorizedBy: $authorizedBy
        declinedByBy: $declinedByBy
        modified: $modified
      ) {
          user_ID
          username
          email
          emmpid
          leavetype
          leave_ID
          from
          to
          nofdays
          remainingleaves
          reason
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteLeaveGQL extends Mutation {
  document = gql`
    mutation deleteLeave(
      $id: ID!,
      $user_ID: String!
      $modified: [modifiedInputs]
    ) {
      deleteLeave(
        id: $id,
        user_ID: $user_ID
        modified: $modified
      ) {
        _id
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
        email
        username
        emmpid
        from
        to
        nofdays
        remainingleaves
        reason
        status
        approvers {
          approverID
          approverUserName
        }
        approvedBy {
          approvedByID
          approvedByUserName
        }
        rejectedBy {
          rejectedByID
          rejectedByUserName
        }
        authorizedBy {
          authorizedByID
          authorizedByUserName
        }
        declinedBy {
          declinedByID
          declinedByUserName
        }
      }
  }
`;

export const GET_USER_QUERY = gql`
   query getUser(
      $query: Pagination!
    ) {
    users(
      query: $query,
    ) {
        _id
        username,
        designation {
          _id
          designation
          leavetype {
            leavetype
            leave_ID
            leavedays
            remainingleaves
          }
        }
      }
  }
`;


@Injectable({
  providedIn: 'root',
})
export class GetUserRoles {

  constructor(
      private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe(u => this.user = u);
  }

  user: any;

  get isAdmin() {
    return this.user && this.user.role === Role.ADMIN;
  }

  get isHRManager() {
    return this.user && this.user.role === Role.HRMANAGER;
  }

  get isManager() {
    return this.user && this.user.role === Role.MANAGER;
  }
}
