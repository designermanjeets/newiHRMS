import { Injectable } from '@angular/core';
import { Mutation, Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class RegisterLeaveGQL extends Mutation {
  document = gql`
    mutation createLeave (
      $userID: String
      $leaveTypeID: String!
      $leaveFrom: ISODate
      $leaveTo: ISODate
      $numberOfDays: Int
      $reason: String
      $created_at: ISODate
      $created_by: String
    ) {
      createLeave(
        userID: $userID
        leaveTypeID: $leaveTypeID
        leaveFrom: $leaveFrom
        leaveTo: $leaveTo
        numberOfDays: $numberOfDays
        reason: $reason
        created_at: $created_at
        created_by: $created_by
      ) {
          userID
          leaveTypeID
          leaveFrom
          leaveTo
          numberOfDays
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
      $modified: [modifiedInputs]
    ) {
      updateLeave(
        id: $id
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
        modified: $modified
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
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class ApproveORejectLeaveGQL extends Mutation {
  document = gql`
    mutation approveORejectLeave (
      $id: ID!
      $userID: String!
      $leaveTypeID: String
      $leaveStatus: String
      $numberOfDays: Int
      $approvers: approversInput
      $approvedBy: approvedByInput
      $rejectedBy: rejectedByInput
      $authorizedBy: authorizedByInput
      $declinedBy: declinedByInput
      $modified: [modifiedInputs]
    ) {
      approveORejectLeave(
        id: $id
        userID: $userID
        leaveTypeID: $leaveTypeID
        numberOfDays: $numberOfDays
        leaveStatus: $leaveStatus
        approvers: $approvers
        approvedBy: $approvedBy
        rejectedBy: $rejectedBy
        authorizedBy: $authorizedBy
        declinedBy: $declinedBy
        modified: $modified
      ) {
        _id
        leaveTypeID
        leaveStatus
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
}

@Injectable({
  providedIn: 'root',
})
export class DeleteLeaveGQL extends Mutation {
  document = gql`
    mutation deleteLeave(
      $id: ID!,
      $userID: String!
      $leaveStatus: String!
      $modified: [modifiedInputs]
    ) {
      deleteLeave(
        id: $id,
        userID: $userID
        leaveStatus: $leaveStatus
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
        leaveTypeID
        leaveType
        userID
        leaveFrom
        leaveTo
        numberOfDays
        reason
        leaveStatus
        firstname
        lastname
        username
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
        userID,
        designationID
        departmentID
      }
  }
`;

