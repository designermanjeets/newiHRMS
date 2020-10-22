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
          carryforward
          carrymax
          remainingleaves
          status
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
          carryforward
          carrymax
          remainingleaves
          status
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
