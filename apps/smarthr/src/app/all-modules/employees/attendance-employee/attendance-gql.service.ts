import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class CreateAttendanceGQL extends Mutation {
  document = gql`
    mutation createAttendance(
        $date: ISODate!
        $userID: String!
        $user_email: String!
        $punchIn: String!
        $punchOut: String!
        $created_at: ISODate!
        $created_by: String
    ) {
      createAttendance(
        date: $date
        userID: $userID,
        user_email: $user_email
        punchIn: $punchIn
        punchOut: $punchOut
        created_at: $created_at
        created_by: $created_by
      ) {
          _id
          date
          punchIn
          punchOut
        }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateAttendanceGQL extends Mutation {
  document = gql`
    mutation updateAttendance(
        $id: ID!
        $date: ISODate!
        $userID: String!
        $user_email: String!
        $punchIn: String!
        $punchOut: String!
        $modified: [modifiedInputs]
    ) {
      updateAttendance(
        id: $id
        date: $date
        userID: $userID,
        user_email: $user_email
        punchIn: $punchIn
        punchOut: $punchOut
        modified: $modified
      ) {
          _id
          date
          punchIn
          punchOut
        }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class DeleteAttendanceGQL extends Mutation {
  document = gql`
    mutation deleteAttendance(
        $id: ID!,
        $date: ISODate!
        $userID: String!
        $user_email: String!
        $modified: [modifiedInputs]
    ) {
      deleteAttendance(
        id:  $id,
        date: $date
        userID: $userID
        user_email: $user_email
        modified: $modified
      ) {
          _id
          date
          punchIn
          punchOut
        }
    }
  `;
}

export const GET_ATTENDANCES_QUERY = gql`
   query getAttendances(
        $pagination: Pagination!
    ) {
      getAttendances(
        query: $pagination
      ) {
          _id
          userID
          punchIn
          punchOut
          date
        }
    }
`;

export const GET_USER_ATTENDANCES_QUERY = gql`
   query getUserAttendances(
        $pagination: Pagination!
    ) {
      getUserAttendances(
        query: $pagination
      ) {
          _id
          userID
          punchIn
          punchOut
          date
        }
    }
`;

@Injectable({
  providedIn: 'root'
})
export class UploadAttendanceFileGQL extends Mutation {
  document = gql`
   mutation UploadAttendanceMutation($file: Upload!) {
    uploadAttendanceFile(file: $file) {
      userID
      date
      punchIn,
      punchOut
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class ImportAttendanceGQL extends Mutation {
  document = gql`
    mutation InsertManyAttendanceMutation(
      $input: [AttendanceInput]!
    ) {
      insertManyAttendances(input: $input) {
        attendances {
          _id,
          employeeID,
          date,
          punchIn,
          punchOut
        }
      }
    }
  `;
}

