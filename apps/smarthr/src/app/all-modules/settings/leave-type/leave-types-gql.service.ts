import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class RegisterLeaveTypeGQL extends Mutation {
  document = gql`
    mutation createLeaveType(
      $leaveType: String!,
      $leaveDays: Int!,
      $carryForward: String,
      $carryMax: Int,
      $created_by: String,
      $created_at: ISODate,
      $status: String,
      $remainingLeaves: Int
    ) {
      createLeaveType(
        leaveType: $leaveType,
        leaveDays: $leaveDays,
        carryForward: $carryForward,
        carryMax: $carryMax,
        created_by: $created_by,
        created_at: $created_at,
        status: $status,
        remainingLeaves: $remainingLeaves
      ) {
        leaveType
        leaveDays
        carryForward
        carryMax,
        status,
        remainingLeaves
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateLeaveTypeGQL extends Mutation {
  document = gql`
    mutation updateLeaveType(
      $id: ID!
      $leaveType: String!,
      $leaveDays: Int!,
      $carryForward: String,
      $carryMax: Int,
      $status: String,
      $remainingLeaves: Int,
      $modified: [modifiedInputs]
    ) {
      updateLeaveType(
        id: $id,
        leaveType: $leaveType,
        leaveDays: $leaveDays,
        carryForward: $carryForward,
        carryMax: $carryMax
        status: $status,
        modified: $modified,
        remainingLeaves: $remainingLeaves
      ) {
        _id
        leaveType
        leaveDays
        carryForward
        carryMax
        status
        remainingLeaves
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteLeaveTypeGQL extends Mutation {
  document = gql`
    mutation deleteLeaveType(
      $id: ID!,
      $modified: [modifiedInputs]
    ) {
      deleteLeaveType(
        id: $id,
        modified: $modified
      ) {
        _id
      }
    }
  `;
}

export const GET_LEAVETYPES_QUERY = gql`
   query getLeaveTypes(
      $pagination: Pagination!
    ) {
      getLeaveTypes(
        query: $pagination
      ) {
        _id
        leaveType
        leaveDays
        carryForward
        carryMax
        status
        remainingLeaves
      }
    }
`;
