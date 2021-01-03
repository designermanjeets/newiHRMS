const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getAttendances(query: Pagination!): Void
    getUserAttendances(query: Pagination!): [Attendance]

  }

  extend type Mutation {

    createAttendance (
      attendanceDate : [AttendanceDateInput]
    ): Attendance,

    updateAttendance (
      id: ID!,
      userID: String!,
      date: ISODate!,
      punchIn: String,
      punchOut: String,
      modified: [modifiedInputs]
    ): Attendance,

    deleteAttendance(
      id: ID!,
      userID: String!,
      date: ISODate!,
      modified: [modifiedInputs]
    ): Attendance,

    uploadAttendanceFile(file: Upload!): Void

    insertManyAttendances(input: Void): Void

  }

  type Attendance {
    _id: ID,
    attendanceDate: [AttendanceDateType]
  }

  input AttendanceInput {
    _id: ID,
    userID: String!,
    email: String,
    username: String,
    firstname: String,
    lastname: String,
    date: ISODate!,
    punchIn: String!,
    punchOut: String!,
    created_by: String,
    created_at: ISODate,
    modified: [modifiedInputs]
  }

  type UploadAttendancesPayload {
    attendances: [Attendance]
  }

  type AttendanceDateType {
      userID: String!,
      email: String,
      username: String,
      firstname: String,
      lastname: String,
      date: ISODate!,
      punchIn: String!,
      punchOut: String!,
      created_by: String,
      created_at: ISODate,
      modified: [modifiedTypes]
  }

  input AttendanceDateInput {
      userID: String!,
      email: String,
      username: String,
      firstname: String,
      lastname: String,
      date: ISODate!,
      punchIn: String!,
      punchOut: String!,
      created_by: String,
      created_at: ISODate,
      modified: [modifiedInputs]
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
