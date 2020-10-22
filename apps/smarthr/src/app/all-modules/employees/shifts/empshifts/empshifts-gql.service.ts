import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class CreateShiftGQL extends Mutation {
  document = gql`
    mutation createShift(
        $shiftname: String!,
        $shiftimeFrom: String!,
        $shiftimeTo: String!,
        $maxshifts: Int!,
        $created_at: ISODate!
        $created_by: String
    ) {
      createShift(
        shiftname: $shiftname,
        shiftimeFrom: $shiftimeFrom,
        shiftimeTo: $shiftimeTo,
        maxshifts: $maxshifts,
        created_at: $created_at
        created_by: $created_by
      ) {
        _id
        shiftname
        shiftimeFrom
        shiftimeTo
        maxshifts
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
        $shiftname: String!,
        $shiftimeFrom: String,
        $shiftimeTo: String,
        $maxshifts: Int,
        $modified: [modifiedInputs]
    ) {
      updateShift(
        id: $id,
        shiftname: $shiftname,
        shiftimeFrom: $shiftimeFrom,
        shiftimeTo: $shiftimeTo,
        maxshifts: $maxshifts,
        modified: $modified
      ) {
        _id
        shiftname
        shiftimeFrom
        shiftimeTo
        maxshifts
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
        $shiftname: String!,
        $modified: [modifiedInputs]
    ) {
      deleteShift(
        id: $id,
        shiftname: $shiftname,
        modified: $modified
      ) {
        _id
        shiftname
        shiftimeTo
        shiftimeFrom
        maxshifts
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
        shiftname
        shiftimeFrom
        shiftimeTo
        maxshifts
      }
    }
`;

