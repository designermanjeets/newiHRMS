const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getDesignations(query: Pagination!): [Designation]

  }

  extend type Mutation {

    createDesignation (
      designation: String!,
      departmentID: String,
      created_at: ISODate,
      created_by: String,
      leaveType: [String]
    ): Designation

    updateDesignation(
      id: ID!,
      designation: String!,
      department: String,
      departmentID: String,
      modified: [modifiedInputs],
      leaveType: [String]
    ): Designation

    deleteDesignation( id: ID!, modified: [modifiedInputs] ): Designation

  }

  type Designation {
    _id: ID,
    designation: String!,
    department: String,
    departmentID: String,
    created_at: ISODate,
    created_by: String,
    modified: [modifiedTypes],
    leaveType: [String]
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
