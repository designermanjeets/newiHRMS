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
      $userID: String
      $username: String
      $email: String
      $employeeID: String
      $leaveType: String!
      $leaveID: String!
      $from: ISODate
      $to: ISODate
      $numberOfDays: Int
      $remainingLeaves: Int
      $reason: String
      $created_at: ISODate
      $created_by: String
    ) {
      createLeave(
        userID: $userID
        username: $username
        email: $email
        employeeID: $employeeID
        leaveType: $leaveType
        leaveID: $leaveID
        from: $from
        to: $to
        numberOfDays: $numberOfDays
        remainingLeaves: $remainingLeaves
        reason: $reason
        created_at: $created_at
        created_by: $created_by
      ) {
          userID
          username
          email
          employeeID
          leaveType
          leaveID
          from
          to
          numberOfDays
          remainingLeaves
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
      $userID: String!
      $leaveTypeID: String!
      $leaveFrom: ISODate
      $leaveTo: ISODate
      $numberOfDays: Int
      $remainingLeaves: Int
      $reason: String
      $approvers: approversInput
      $approvedBy: approvedByInput
      $rejectedBy: rejectedByInput
      $modified: [modifiedInputs]
      $authorizedBy: authorizedByInput
      $declinedBy: declinedByInput
    ) {
      updateLeave(
        id: $id
        userID: $userID
        leaveTypeID: $leaveTypeID
        leaveFrom: $leaveFrom
        leaveTo: $leaveTo
        numberOfDays: $numberOfDays
        remainingLeaves: $remainingLeaves
        reason: $reason
        approvers: $approvers
        approvedBy: $approvedBy
        rejectedBy: $rejectedBy
        authorizedBy: $authorizedBy
        declinedByBy: $declinedByBy
        modified: $modified
      ) {
          userID
          username
          email
          employeeID
          leaveTypeID
          leaveFrom
          leaveTo
          numberOfDays
          remainingLeaves
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
      $userID: String!
      $modified: [modifiedInputs]
    ) {
      deleteLeave(
        id: $id,
        userID: $userID
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
        leaveID
        leaveType
        userID
        email
        username
        employeeID
        from
        to
        numberOfDays
        remainingLeaves
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
          leaveType {
            leaveType
            leaveID
            leaveDays
            remainingLeaves
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
