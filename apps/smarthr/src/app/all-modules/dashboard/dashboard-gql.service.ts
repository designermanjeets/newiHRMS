import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class DashboardGQLService {

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
        username,
        email,
        firstname,
        lastname,
        employeeID,
        corporateID,
        mobile,
        password,
        joiningDate,
        departmentID,
        designationID
        _id,
        roleID
        department
        designation
      }
  }
 `;

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
