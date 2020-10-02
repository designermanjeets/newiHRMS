const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getLeaveTypes(query: Pagination!): [LeaveType]

  }

  extend type Mutation {

    createLeaveType (
      leavetype: String,
      leavedays: String,
      carryforward: String,
      carrymax: String,
      status: String,
      created_at: ISODate,
      created_by: String
    ): LeaveType

    updateLeaveType(
      id: ID!,
      leavetype: String,
      leavedays: String,
      carryforward: String,
      carrymax: String,
      status: String,
      modified: [modifiedInputs]
    ): LeaveType

    deleteLeaveType( id: ID!, modified: [modifiedInputs] ): LeaveType
  }


  type LeaveType {
    _id: ID,
    leavetype: String!,
    leavedays: String!,
    carryforward: String,
    carrymax: String,
    status: String,
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
