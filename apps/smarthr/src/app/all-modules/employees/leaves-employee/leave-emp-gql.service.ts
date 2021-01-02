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
    mutation approveorejectLeave (
      $id: ID!
      $userID: String!
      $leaveType: String
      $leaveID: String
      $status: String
      $numberOfDays: Int
      $approvers: [approversInput]
      $approvedBy: approvedByInput
      $rejectedBy: rejectedByInput
      $authorizedBy: authorizedByInput
      $declinedBy: declinedByInput
      $modified: [modifiedInputs]
    ) {
      approveorejectLeave(
        id: $id
        userID: $userID
        leaveType: $leaveType
        leaveID: $leaveID
        numberOfDays: $numberOfDays
        status: $status
        approvers: $approvers
        approvedBy: $approvedBy
        rejectedBy: $rejectedBy
        authorizedBy: $authorizedBy
        declinedBy: $declinedBy
        modified: $modified
      ) {
        _id
        leaveType
        leaveID
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
}

@Injectable({
  providedIn: 'root',
})
export class DeleteLeaveGQL extends Mutation {
  document = gql`
    mutation deleteLeave(
      $id: ID!,
      $userID: String!
      $status: String!
      $modified: [modifiedInputs]
    ) {
      deleteLeave(
        id: $id,
        userID: $userID
        status: $status
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
        leaveApplied {
          _id
          userID
          username
          email
          employeeID
          leaveType
          reason
          leaveID
          numberOfDays
          status
          created_at
          created_by
          from
          to
          remainingLeaves
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
        }
      }
  }
`;

