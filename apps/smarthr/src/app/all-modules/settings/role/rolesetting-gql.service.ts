import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class CreateRoleGQL extends Mutation {
  document = gql`
    mutation createRole (
    $role_name: String!,
    $mod_employee: Boolean,
    $mod_holidays: Boolean,
    $mod_leaves: Boolean,
    $mod_events: Boolean,
    $mod_jobs: Boolean,
    $mod_assets: Boolean,
    $permissions: PermissionsInput
    $created_at: ISODate
    $created_by: String
  ) {
    createRole(
      role_name: $role_name,
      mod_employee: $mod_employee,
      mod_holidays: $mod_holidays,
      mod_leaves: $mod_leaves,
      mod_events: $mod_events,
      mod_jobs: $mod_jobs,
      mod_assets: $mod_assets,
      permissions: $permissions,
      created_at: $created_at,
      created_by: $created_by
    ){
      id,
      role_name,
      mod_employee,
      mod_holidays,
      mod_jobs,
      mod_leaves,
      mod_events,
      mod_jobs,
      mod_assets
    }
  }
 `;
}


@Injectable({
  providedIn: 'root',
})
export class UpdateRoleGQL extends Mutation {
  document = gql`
    mutation updateRole (
    $id: ID!,
    $role_name: String!,
    $mod_employee: Boolean,
    $mod_holidays: Boolean,
    $mod_leaves: Boolean,
    $mod_events: Boolean,
    $mod_jobs: Boolean,
    $mod_assets: Boolean,
    $permissions: PermissionsInput,
    $modified: [modifiedInputs]
  ) {
    updateRole(
      id:  $id,
      role_name: $role_name,
      mod_employee: $mod_employee,
      mod_holidays: $mod_holidays,
      mod_leaves: $mod_leaves,
      mod_events: $mod_events,
      mod_jobs: $mod_jobs,
      mod_assets: $mod_assets,
      permissions: $permissions,
      modified: $modified
    ){
      id,
      role_name,
      mod_employee,
      mod_holidays,
      mod_jobs,
      mod_leaves,
      mod_events,
      mod_jobs,
      mod_assets
    }
  }
 `;
}


@Injectable({
  providedIn: 'root',
})
export class DeleteRoleGQL extends Mutation {
  document = gql`
    mutation DeleteRole (
    $id: ID!,
    $role_name: String!
    $modified: [modifiedInputs]
  ) {
    deleteRole(
      id:  $id,
      role_name: $role_name
      modified: $modified
    ){
      id,
      role_name,
      mod_employee,
      mod_holidays,
      mod_jobs,
      mod_leaves,
      mod_events,
      mod_jobs,
      mod_assets
    }
  }
 `;
}

export const GET_ROLES_QUERY = gql`
   query getRoles (
      $query: Pagination!
    ) {
      getRoles(
        query: $query
      ){
        id,
        role_name,
        mod_employee,
        mod_holidays,
        mod_jobs,
        mod_leaves,
        mod_events,
        mod_jobs,
        mod_assets,
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
`;
