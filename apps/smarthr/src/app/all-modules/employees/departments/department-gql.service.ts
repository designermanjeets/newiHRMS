import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class CreateDepartmentGQL extends Mutation {
  document = gql`
    mutation createDepartment(
        $department: String!
        $created_at: ISODate
    ) {
      createDepartment(
        department: $department
        created_at: $created_at
      ) {
        department
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateDepartmentGQL extends Mutation {
  document = gql`
    mutation updateDepartment(
      $id: ID!,
      $department: String!
      $modified: [modifiedInputs]
    ) {
      updateDepartment(
        id: $id,
        department: $department
        modified: $modified
      ) {
        department,
        created_at
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class DeleteDepartmentGQL extends Mutation {
  document = gql`
    mutation deleteDepartment(
      $id: ID!,
      $modified: [modifiedInputs]
    ) {
      deleteDepartment(
        id: $id,
        modified: $modified
      ) {
        department
      }
    }
  `;
}


export const GET_DEPARTMENTS_QUERY = gql`
   query getDepartments(
      $pagination: Pagination!
    ) {
      getDepartments(
        query: $pagination
      ) {
        _id
        department
      }
    }
`;

@Injectable({
  providedIn: 'root'
})
export class SetGetDepartmentsService {

  departments: any;

  constructor() { }

  getDepartments(_id) {
    if (!this.departments) {
      return false;
    } else {
      return this.departments.find(
        (h: any) => h._id === _id);
    }

  }

  setDepartments(data) {
    this.departments = data;
  }

}
