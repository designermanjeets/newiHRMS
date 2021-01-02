const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getLeavesApplied(query: Pagination!): [LeaveApplied]

  }

  extend type Mutation {

    createLeave (
      userID: String,
      username: String,
      email: String,
      employeeID: String,
      leaveType: String,
      leaveID: String,
      numberOfDays: Int,
      status: String,
      reason: String,
      created_at: ISODate,
      created_by:String,
      from: ISODate,
      to: ISODate,
      approvers: [approversInput],
      remainingLeaves: Int
    ): LeaveApplied,

    updateLeave(
      id: ID!
      userID: String!
      username: String
      email: String
      employeeID: String
      leaveType: String
      leaveID: String
      numberOfDays: Int
      status: String
      reason: String
      created_at: ISODate
      created_by:String
      from: ISODate
      to: ISODate
      remainingLeaves: Int
      approvers: [approversInput]
      approvedBy: approvedByInput
      rejectedBy: rejectedByInput
      authorizedBy: authorizedByInput
      declinedBy: declinedByInput
      modified: [modifiedInputs]
    ): LeaveApplied,

    approveorejectLeave(
      id: ID!
      userID: String!
      leaveType: String
      leaveID: String
      numberOfDays: Int
      status: String
      approvers: [approversInput]
      approvedBy: approvedByInput
      rejectedBy: rejectedByInput
      authorizedBy: authorizedByInput
      declinedBy: declinedByInput
      modified: [modifiedInputs]
    ): LeaveApplied

    deleteLeave( id: ID!, status: String!, userID: String!, modified: [modifiedInputs] ): LeaveApplied
  }

  type LeaveApplied{
    _id: ID
    userID: String
    username: String
    email: String
    employeeID: String
    leaveType: String
    leaveID: String
    numberOfDays: Int
    status: String
    reason: String
    created_at: ISODate
    created_by:String
    from: ISODate
    to: ISODate
    remainingLeaves: Int
    approvers: [approversType]
    approvedBy: approvedByType
    rejectedBy: rejectedByType
    authorizedBy: authorizedByType
    declinedBy: declinedByType
    modified: [modifiedTypes],
  }

  input approversInput {
      approverID: String,
      approverUserName: String
  }

  input approvedByInput {
      approvedByID: String,
      approvedByUserName: String
  }

  input rejectedByInput {
      rejectedByID: String,
      rejectedByUserName: String
  }

  input authorizedByInput {
      authorizedByID: String,
      authorizedByUserName: String
  }

  input declinedByInput {
      declinedByID: String,
      declinedByUserName: String
  }

  type approversType {
      approverID: String,
      approverUserName: String
  }

  type approvedByType {
      approvedByID: String,
      approvedByUserName: String
  }

  type rejectedByType {
      rejectedByID: String,
      rejectedByUserName: String
  }

  type authorizedByType {
      authorizedByID: String,
      authorizedByUserName: String
  }

  type declinedByType {
      declinedByID: String,
      declinedByUserName: String
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
