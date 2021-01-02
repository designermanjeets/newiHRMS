import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGQLService {

  users: [];

  constructor() { }

  getUser(id) {
    if (!this.users) {
      return false;
    } else {
      return this.users.find(
        (user: any) => user.employeeID === id);
    }

  }

  setUsers(users) {
    this.users = users;
  }
}

export const GET_USERS_QUERY = gql`
   query getUsers(
      $pagination: Pagination!
    ) {
    users(
      query: $pagination,
    ) {
        _id
        username,
        email,
        firstname,
        lastname,
        roleID,
        employeeID,
        corporateID,
        mobile,
        password,
        joiningDate,
        departmentID,
        shiftIDs
        designationID
        department
        designation
        role
      }
  }
 `;


@Injectable({
  providedIn: 'root',
})
export class GET_USER_QUERY extends Query<Response> {
  document = gql`
   query getUser(
      $email: String!
    ) {
    user(
      email: $email,
    ) {
        username,
        email,
        firstname,
        lastname,
        roleID,
        employeeID,
        corporateID,
        mobile,
        joiningDate,
        departmentID,
        shiftIDs
        designationID
        department
        designation
        _id,
      }
  }
 `;
}


@Injectable({
  providedIn: 'root'
})
export class EmpUpdateGQLService extends Mutation {

  document = gql`
    mutation EmpUpdateMutation(
      $id: ID!
      $username: String!
      $email: String!
      $password: String
      $firstname: String
      $lastname: String
      $roleID:String
      $corporateID: String
      $employeeID: String!
      $mobile: String
      $joiningDate: ISODate
      $departmentID: String
      $designationID: String
      $shiftIDs: [String]
      $modified: [modifiedInputs]
    ) {
    updateUser(
        id: $id,
        username: $username,
        email: $email,
        password: $password,
        firstname: $firstname,
        lastname: $lastname,
        roleID: $roleID,
        corporateID: $corporateID,
        employeeID: $employeeID,
        mobile: $mobile,
        joiningDate: $joiningDate,
        departmentID: $departmentID
        designationID: $designationID
        shiftIDs: $shiftIDs
        modified: $modified
    ) {
        username,
        email,
        roleID,
        firstname,
        lastname,
        corporateID,
        employeeID,
        mobile,
        joiningDate,
        departmentID,
        shiftIDs,
        designationID,
      }
  }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class CreateUserGQL extends Mutation {
  document = gql`
    mutation SignUpMutation(
      $username: String!
      $email: String!
      $password: String!
      $roleID: String!
      $firstname: String
      $lastname: String
      $employeeID: String!
      $corporateID: String!
      $joiningDate: ISODate!
      $departmentID: String
      $designationID: String,
      $shiftIDs: [String]
      $mobile: String,
      $created_by: String,
      $created_at: ISODate!
    ) {
    signup(
        username: $username,
        email: $email,
        password: $password,
        roleID: $roleID,
        firstname: $firstname
        lastname: $lastname,
        employeeID: $employeeID,
        corporateID: $corporateID,
        joiningDate: $joiningDate,
        departmentID: $departmentID
        designationID: $designationID
        shiftIDs: $shiftIDs
        mobile: $mobile,
        created_by: $created_by,
        created_at: $created_at
    ) {
        username,
        email,
        roleID,
        firstname,
        lastname,
        employeeID,
        corporateID,
        joiningDate,
        departmentID,
        designationID,
        shiftIDs
        mobile,
      }
  }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class ImportUsersGQL extends Mutation {
  document = gql`
    mutation InsertManyMutation(
      $input: [UserInput]!
    ) {
      insertManyUsers(input: $input) {
        users {
          username
        }
      }
    }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class DeleteUserGQL extends Mutation {
  document = gql`
    mutation DeleteMutation(
      $email: String!
      $modified: [modifiedInputs]
    ) {
    deleteUser(
        email: $email,
        modified: $modified
    ) {
        email
      }
  }
  `;
}

export const GET_COMPANIES_QUERY = gql`
   query getCompanies(
      $pagination: Pagination!
    ) {
    getCompanies(
      query: $pagination,
    ) {
        corporateID,
      }
  }
`;

export const GET_ROLES_QUERY = gql`
   query getRoles(
      $pagination: Pagination!
    ) {
    getRoles(
      query: $pagination,
    ) {
        _id
        role_name
      }
  }
`;


export const GET_SHIFTS_QUERY = gql`
   query getShifts(
        $pagination: Pagination!
    ) {
    getShifts(
        query: $pagination,
    ) {
        _id
        shiftName
        shiftTmeFrom
        shiftTimeTo
        maxShifts
      }
  }
`;
