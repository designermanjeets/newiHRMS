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
        },
        _id,
        permissions {
          holiday {
            read
            write,
            create
            delete
            import
            export
          }
          leave {
            read
            write,
            create
            delete
            import
            export
          }
          assets {
            read
            write,
            create
            delete
            import
            export
          }
        }
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
        role,
        emmpid,
        corporateid,
        mobile,
        joiningdate,
        department,
        department_ID,
        designation {
          _id
          designation
        },
        _id,
        permissions {
          holiday {
            read
            write,
            create
            delete
            import
            export
          }
          leave {
            read
            write,
            create
            delete
            import
            export
          }
          assets {
            read
            write,
            create
            delete
            import
            export
          }
        }
      }
  }
 `;
}


@Injectable({
  providedIn: 'root'
})
export class EmpdetailGQLService extends Mutation {

  document = gql`
    mutation EmpUpdateMutation(
      $id: ID!
      $username: String!
      $email: String!
      $password: String
      $firstname: String
      $lastname: String
      $role:String
      $corporateid: String
      $emmpid: String
      $mobile: String
      $joiningdate: ISODate
      $department: String
      $department_ID: String
      $designation: designationInputs
      $designation_ID: String
      $permissions:PermissionsInput
      $modified: [modifiedInputs]
    ) {
    updateUser(
        id: $id,
        username: $username,
        email: $email,
        password: $password,
        firstname: $firstname,
        lastname: $lastname,
        role: $role,
        corporateid: $corporateid,
        emmpid: $emmpid,
        mobile: $mobile,
        joiningdate: $joiningdate,
        department: $department
        department_ID: $department_ID
        designation: $designation
        designation_ID: $designation_ID
        permissions: $permissions,
        modified: $modified
    ) {
        username,
        email,
        role,
        firstname,
        lastname,
        corporateid,
        emmpid,
        mobile,
        joiningdate,
        department,
        department_ID,
        designation {
          _id
          designation
        },
        designation_ID,
        permissions {
          holiday {
            read
            write,
            create
            delete
            import
            export
          }
          leave {
            read
            write,
            create
            delete
            import
            export
          }
          assets {
            read
            write,
            create
            delete
            import
            export
          }
        }
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
      $role: String
      $firstname: String
      $lastname: String
      $emmpid: String!
      $corporateid: String!
      $joiningdate: ISODate
      $department: String
      $department_ID: String
      $designation: designationInputs,
      $designation_ID: String,
      $mobile: String
      $permissions: PermissionsInput
    ) {
    signup(
        username: $username,
        email: $email,
        password: $password,
        role: $role,
        firstname: $firstname
        lastname: $lastname,
        emmpid: $emmpid,
        corporateid: $corporateid,
        joiningdate: $joiningdate,
        department: $department
        department_ID: $department_ID
        designation: $designation
        designation_ID: $designation_ID
        mobile: $mobile,
        permissions: $permissions,
    ) {
        username,
        email,
        role,
        firstname,
        lastname,
        emmpid,
        corporateid,
        joiningdate,
        department,
        department_ID,
        designation {
          _id
          designation
        },
        designation_ID,
        mobile,
        permissions {
          holiday {
            read
            write,
            create
            delete
            import
            export
          }
          leave {
            read
            write,
            create
            delete
            import
            export
          }
          assets {
            read
            write,
            create
            delete
            import
            export
          }
        }
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
        corporateid,
      }
  }
`;
