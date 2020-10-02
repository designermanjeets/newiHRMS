const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getDepartments(query: Pagination!): [Department]

  }

  extend type Mutation {

    createDepartment (
      department: String!,
      created_at: ISODate,
      created_by: String
    ): Department

    updateDepartment(
      id: ID!,
      department: String!,
      modified: [modifiedInputs]
    ): Department

    deleteDepartment( id: ID!, modified: [modifiedInputs] ): Department

  }

  type Department {
    _id: ID,
    department: String!,
    created_at: ISODate,
    created_by: String,
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
