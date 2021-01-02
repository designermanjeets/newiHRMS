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
      $departmentID: String
      $created_at: ISODate
      $leaveType: [String]
    ) {
      createDesignation(
        designation: $designation
        departmentID: $departmentID
        created_at: $created_at
        leaveType: $leaveType
      ) {
        designation
        departmentID
        leaveType
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
      $departmentID: String
      $modified: [modifiedInputs],
      $leaveType: [String]
    ) {
      updateDesignation(
        id: $id,
        designation: $designation
        department: $department
        departmentID: $departmentID
        modified: $modified,
        leaveType: $leaveType
      ) {
        designation
        department
        departmentID
        leaveType
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
        department
        departmentID,
        leaveType
      }
    }
`;

@Injectable({
  providedIn: 'root'
})
export class SetGetDesignationsService {

  designations: any;
  departments: any;
  shifts: any;

  constructor() { }

  getDesignations(id) {
    if (!this.designations) {
      return false;
    } else {
      return this.designations.find(
        (h: any) => h._id === id);
    }
  }

  setDesignations(data) {
    this.designations = data;
  }

  setDepartments(data) {
    this.departments = data;
  }

  getDepartment(id) { // Same function but can be extended in future
    if (!this.departments) {
      return false;
    } else {
      return this.departments.find(
        (h: any) => h._id === id);
    }
  }



  setShifts(data) {
    this.shifts = data;
  }

  getShift(id) { // Same function but can be extended in future
    if (!this.shifts) {
      return false;
    } else {
      return this.shifts.find( (h: any) => h._id === id);
    }
  }

  getAllDepartments() {
    return this.departments;
  }

}
