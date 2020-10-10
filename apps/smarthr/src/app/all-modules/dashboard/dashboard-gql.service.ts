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
        (user: any) => user.emmpid === id);
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
        role,
        emmpid,
        corporateid,
        mobile,
        password,
        joiningdate,
        department,
        department_ID,
        designation {
          _id
          designation
          leavetype {
            leavetype
            leave_ID
            leavedays
            carryforward
            carrymax
          }
        },
        _id,
        Role {
          _id
          role_name
          mod_employee
          mod_holidays
          mod_leaves
          mod_events
          mod_jobs
          mod_assets
          permissions {
            employees {
              read
              write
              create
              delete
              import
              export
            },
            holidays {
              read
              write
              create
              delete
              import
              export
            },
            leaves {
              read
              write
              create
              delete
              import
              export
            },
            events {
              read
              write
              create
              delete
              import
              export
            },
            jobs {
              read
              write
              create
              delete
              import
              export
            },
            assets {
              read
              write
              create
              delete
              import
              export
            }
          }
        }
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
        corporateid,
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
