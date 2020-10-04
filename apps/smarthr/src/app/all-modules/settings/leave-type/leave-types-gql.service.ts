import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class RegisterLeaveTypeGQL extends Mutation {
  document = gql`
    mutation createLeaveType(
      $leavetype: String!,
      $leavedays: Int!,
      $carryforward: String,
      $carrymax: Int,
      $created_by: String,
      $created_at: ISODate,
      $status: String,
      $remainingleaves: Int
    ) {
      createLeaveType(
        leavetype: $leavetype,
        leavedays: $leavedays,
        carryforward: $carryforward,
        carrymax: $carrymax,
        created_by: $created_by,
        created_at: $created_at,
        status: $status,
        remainingleaves: $remainingleaves
      ) {
        leavetype
        leavedays
        carryforward
        carrymax,
        status,
        remainingleaves
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
      $leavetype: String!,
      $leavedays: Int!,
      $carryforward: String,
      $carrymax: Int,
      $status: String,
      $remainingleaves: Int,
      $modified: [modifiedInputs]
    ) {
      updateLeaveType(
        id: $id,
        leavetype: $leavetype,
        leavedays: $leavedays,
        carryforward: $carryforward,
        carrymax: $carrymax
        status: $status,
        modified: $modified,
        remainingleaves: $remainingleaves
      ) {
        _id
        leavetype
        leavedays
        carryforward
        carrymax
        status
        remainingleaves
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
        leavetype
        leavedays
        carryforward
        carrymax
        status
        remainingleaves
      }
    }
`;
