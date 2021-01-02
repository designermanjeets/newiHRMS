import gql from 'graphql-tag';
import { Mutation } from 'apollo-angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadFileGQL extends Mutation {
  document = gql`
   mutation UploadMutation($file: Upload!) {
    uploadFile(file: $file) {
      username
      employeeID
      email
      }
    }
  `;
}
