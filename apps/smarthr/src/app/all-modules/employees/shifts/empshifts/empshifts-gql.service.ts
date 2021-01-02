import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class CreateShiftGQL extends Mutation {
  document = gql`
    mutation createShift(
        $shiftName: String!,
        $shiftTmeFrom: String!,
        $shiftTimeTo: String!,
        $maxShifts: Int!,
        $created_at: ISODate!
        $created_by: String
    ) {
      createShift(
        shiftName: $shiftName,
        shiftTmeFrom: $shiftTmeFrom,
        shiftTimeTo: $shiftTimeTo,
        maxShifts: $maxShifts,
        created_at: $created_at
        created_by: $created_by
      ) {
        _id
        shiftName
        shiftTmeFrom
        shiftTimeTo
        maxShifts
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateShiftGQL extends Mutation {
  document = gql`
    mutation updateShift(
        $id: ID!,
        $shiftName: String!,
        $shiftTmeFrom: String,
        $shiftTimeTo: String,
        $maxShifts: Int,
        $modified: [modifiedInputs]
    ) {
      updateShift(
        id: $id,
        shiftName: $shiftName,
        shiftTmeFrom: $shiftTmeFrom,
        shiftTimeTo: $shiftTimeTo,
        maxShifts: $maxShifts,
        modified: $modified
      ) {
        _id
        shiftName
        shiftTmeFrom
        shiftTimeTo
        maxShifts
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class DeleteShiftGQL extends Mutation {
  document = gql`
    mutation deleteShift(
        $id: ID!,
        $shiftName: String!,
        $modified: [modifiedInputs]
    ) {
      deleteShift(
        id: $id,
        shiftName: $shiftName,
        modified: $modified
      ) {
        _id
        shiftName
        shiftTimeTo
        shiftTmeFrom
        maxShifts
      }
    }
  `;
}

export const GET_SHIFTS_QUERY = gql`
   query getShifts(
      $pagination: Pagination!
    ) {
      getShifts(
        query: $pagination
      ) {
        _id
        shiftName
        shiftTmeFrom
        shiftTimeTo
        maxShifts
      }
    }
`;

