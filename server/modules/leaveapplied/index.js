const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getLeavesApplied(query: Pagination!): [LeaveApplied]

  }

  extend type Mutation {

    createLeave (
      userID: String,
      leaveTypeID: String,
      numberOfDays: Int,
      leaveStatus: String,
      reason: String,
      created_at: ISODate,
      created_by:String,
      leaveFrom: ISODate,
      leaveTo: ISODate,
      approvers: approversInput,
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
      leaveStatus: String
      reason: String
      created_at: ISODate
      created_by:String
      leaveFrom: ISODate
      leaveTo: ISODate
      remainingLeaves: Int
      approvers: approversInput
      approvedBy: approvedByInput
      rejectedBy: rejectedByInput
      authorizedBy: authorizedByInput
      declinedBy: declinedByInput
      modified: [modifiedInputs]
    ): LeaveApplied,

    approveORejectLeave(
      id: ID!
      userID: String!
      leaveTypeID: String
      numberOfDays: Int
      leaveStatus: String
      approvers: approversInput
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
    leaveTypeID: String
    leaveType: String
    numberOfDays: Int
    leaveStatus: String
    reason: String
    created_at: ISODate
    created_by:String
    leaveFrom: ISODate
    leaveTo: ISODate
    username: String
    firstname: String
    lastname: String
    approvers: approversType
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
