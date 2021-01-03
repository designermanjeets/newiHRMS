import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class CreateAttendanceAdminGQL extends Mutation {
  document = gql`
    mutation createAttendance(
        $date: ISODate!
        $userID: String!
        $user_email: String!
        $username: String
        $firstname: String
        $lastname: String
        $punchIn: String!
        $punchOut: String!
        $created_at: ISODate!
        $created_by: String
    ) {
      createAttendance(
        date: $date
        userID: $userID,
        user_email: $user_email
        username: $username
        firstname: $firstname
        lastname: $lastname
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
export class UpdateAttendanceAdminGQL extends Mutation {
  document = gql`
    mutation updateAttendance(
        $id: ID!
        $date: ISODate!
        $userID: String!
        $user_email: String!
        $username: String
        $firstname: String
        $lastname: String
        $punchIn: String!
        $punchOut: String!
        $modified: [modifiedInputs]
    ) {
      updateAttendance(
        id: $id
        date: $date
        userID: $userID,
        user_email: $user_email
        username: $username
        firstname: $firstname
        lastname: $lastname
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
export class DeleteAttendanceAdminGQL extends Mutation {
  document = gql`
    mutation deleteAttendance(
        $id: ID!,
        $date: ISODate!
        $userID: String!
        $modified: [modifiedInputs]
    ) {
      deleteAttendance(
        id:  $id,
        date: $date
        userID: $userID
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

export const GET_ATTENDANCES_ADMIN_QUERY = gql`
   query getAttendances(
        $pagination: Pagination!
    ) {
      getAttendances(
        query: $pagination
      )
    }
`;

export const GET_USER_ATTENDANCES_ADMIN_QUERY = gql`
   query getUserAttendances(
        $pagination: Pagination!
    ) {
      getUserAttendances(
        query: $pagination
      ) {
          _id
          userID
          username
          firstname
          lastname
          punchIn
          punchOut
          date
        }
    }
`;

@Injectable({
  providedIn: 'root'
})
export class UploadAttendanceFileADMINGQL extends Mutation {
  document = gql`
   mutation UploadAttendanceMutation($file: Upload!) {
      uploadAttendanceFile(file: $file)
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class ImportAttendanceADMINGQL extends Mutation {
  document = gql`
    mutation InsertManyAttendanceMutation(
      $input: Void
    ) {
      insertManyAttendances(input: $input)
    }
  `;
}

