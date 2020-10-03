const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getLeavesApplied(query: Pagination!): [LeaveApplied]

  }

  extend type Mutation {

    createLeave (
      user_ID: String,
      leavetype: String,
      leave_ID: String,
      nofdays: String,
      status: String,
      approver: String,
      reason: String,
      created_at: ISODate,
      created_by:String,
      from: ISODate,
      to: ISODate,
      remaingleaves: String
    ): LeaveApplied,

    updateLeave(
      id: ID!
      user_ID: String!
      leavetype: String
      leave_ID: String
      nofdays: String
      status: String
      approver: String
      reason: String
      created_at: ISODate
      created_by:String
      from: ISODate
      to: ISODate
      remaingleaves: String
    ): LeaveApplied

    deleteLeave( id: ID!, user_ID: String!, modified: [modifiedInputs] ): LeaveApplied
  }

  type LeaveApplied{
    _id: ID
    user_ID: String
    leavetype: String
    leave_ID: String
    nofdays: String
    status: String
    approver: String
    reason: String
    created_at: ISODate
    created_by:String
    from: ISODate
    to: ISODate
    remaingleaves: String
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
