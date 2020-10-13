const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getAttendances(query: Pagination!): [Attendance]

  }

  extend type Mutation {

    createAttendance (
      user_ID: String!,
      user_email: String!,
      date: ISODate!,
      punchIn: String!,
      punchOut: String!,
      created_at: ISODate!,
      created_by: String,
    ): Attendance,

    updateAttendance (
      id: ID!,
      user_ID: String!,
      user_email: String!,
      date: ISODate!,
      punchIn: String,
      punchOut: String,
      modified: [modifiedInputs]
    ): Attendance,

    deleteAttendance(
      id: ID!,
      user_ID: String!,
      user_email: String!,
      date: ISODate!,
      modified: [modifiedInputs]
    ): Attendance,
  }

  type Attendance {
    _id: ID,
    user_ID: String!,
    user_email: String!,
    date: ISODate!,
    punchIn: String!,
    punchOut: String!,
    created_by: String,
    created_at: ISODate,
    modified: [modifiedTypes]
  }


  input AttendanceInput {
    _id: ID,
    user_ID: String!,
    user_email: String!,
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
