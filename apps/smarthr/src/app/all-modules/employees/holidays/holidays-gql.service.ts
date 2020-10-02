import { Injectable } from '@angular/core';
import { Mutation } from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root',
})
export class RegisterHolidayGQL extends Mutation {
  document = gql`
    mutation CreateHoliday(
      $title: String,
      $date: ISODate,
      $day: String,
      $paid: String,
      $created_by: String,
      $created_at: ISODate,
    ) {
    createHoliday(
      title: $title,
      date: $date,
      day: $day,
      paid: $paid
      created_by: $created_by,
      created_at: $created_at,
    ) {
      title,
      date,
      day,
      paid
      }
  }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateHolidayGQL extends Mutation {
  document = gql`
    mutation updateHoliday(
      $id: ID!,
      $title: String,
      $date: ISODate,
      $day: String,
      $paid: String,
      $modified: [modifiedInputs]
    ) {
    updateHoliday(
      id: $id,
      title: $title,
      date: $date,
      day: $day,
      paid: $paid,
      modified: $modified
    ) {
      _id,
      title,
      date,
      day,
      paid
      }
  }
  `;
}


@Injectable({
  providedIn: 'root',
})
export class DeleteHolidayGQL extends Mutation {
  document = gql`
    mutation deleteHoliday(
      $id: ID!,
      $modified: [modifiedInputs]
    ) {
    deleteHoliday(
      id: $id,
      modified: $modified
    ) {
        _id
      }
  }
  `;
}

export const GET_HOLIDAYS_QUERY = gql`
   query getHolidays(
      $pagination: Pagination!
    ) {
    getHolidays(
      query: $pagination,
    ) {
        _id,
        title,
        date,
        day,
        paid
      }
  }
`;
