const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getRoles(query: Pagination!): [Role]

  }

  extend type Mutation {

    createRole (
      role_name: String!,
      mod_employee: Boolean,
      mod_holidays: Boolean,
      mod_leaves: Boolean,
      mod_events: Boolean,
      mod_jobs: Boolean,
      mod_assets: Boolean,
      created_by: String,
      created_at: ISODate,
      permissions: PermissionsInput
    ): Role,

    updateRole(
      id: ID!,
      role_name: String!,
      mod_employee: Boolean,
      mod_holidays: Boolean,
      mod_leaves: Boolean,
      mod_events: Boolean,
      mod_jobs: Boolean,
      mod_assets: Boolean,
      created_by: String,
      created_at: ISODate,
      permissions: PermissionsInput
      modified: [modifiedInputs]
    ): Role,

    deleteRole( id: ID!, role_name: String, modified: [modifiedInputs] ): Role,
  }

  type Role{
    _id: ID,
    role_name: String,
    mod_employee: Boolean,
    mod_holidays: Boolean,
    mod_leaves: Boolean,
    mod_events: Boolean,
    mod_jobs: Boolean,
    mod_assets: Boolean,
    created_by: String,
    created_at: ISODate,
    permissions: permissions
    modified: [modifiedTypes]
  }
`

const resolvers = require('./resolvers')

module.exports = {
  // typeDefs is an array, because it should be possible to split your schema if the schema grows to big, you can just export multiple here
  typeDefs: [
    typeDefs
  ],
  resolvers
}
