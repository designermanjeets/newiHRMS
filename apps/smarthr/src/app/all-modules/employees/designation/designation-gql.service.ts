import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class CreateDesignationGQL extends Mutation {
  document = gql`
    mutation createDesignation(
      $designation: String!
      $department: String
      $department_ID: String
      $created_at: ISODate
      $leavetype: [leaveTypesInputs]
    ) {
      createDesignation(
        designation: $designation
        department: $department
        department_ID: $department_ID
        created_at: $created_at
        leavetype: $leavetype
      ) {
        designation
        department,
        department_ID
        leavetype {
          leavetype
          leavedays
        }
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateDesignationGQL extends Mutation {
  document = gql`
    mutation updateDesignation(
      $id: ID!,
      $designation: String!
      $department: String
      $department_ID: String
      $modified: [modifiedInputs],
      $leavetype: [leaveTypesInputs]
    ) {
      updateDesignation(
        id: $id,
        designation: $designation
        department: $department
        department_ID: $department_ID
        modified: $modified,
        leavetype: $leavetype
      ) {
        designation
        department
        department_ID
        leavetype {
          leavetype
          leavedays
          leave_ID
        }
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class DeleteDesignationGQL extends Mutation {
  document = gql`
    mutation deleteDesignation(
      $id: ID!,
      $modified: [modifiedInputs]
    ) {
      deleteDesignation(
        id: $id,
        modified: $modified
      ) {
        designation
        department
      }
    }
  `;
}

export const GET_DESIGNATIONS_QUERY = gql`
   query getDesignations(
      $pagination: Pagination!
    ) {
      getDesignations(
        query: $pagination
      ) {
        _id
        designation
        department,
        department_ID,
        leavetype {
          leavetype,
          leave_ID,
          leavedays
        }
      }
    }
`;

@Injectable({
  providedIn: 'root'
})
export class SetGetDesignationsService {

  designations: any;
  departments: any;

  constructor() { }

  getDesignations(_id) {
    if (!this.designations) {
      return false;
    } else {
      return this.designations.find(
        (h: any) => h._id === _id);
    }
  }

  setDesignations(data) {
    this.designations = data;
  }

  setDepartments(data) {
    this.departments = data;
  }

  getDepartment(_id) { // Same function but can be extented in future
    if (!this.departments) {
      return false;
    } else {
      return this.departments.find(
        (h: any) => h._id === _id);
    }
  }

  getAllDepartments() {
    return this.departments;
  }

}
