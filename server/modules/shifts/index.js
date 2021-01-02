const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getShifts(query: Pagination!): [Shift]

  }

  extend type Mutation {

    createShift (
      shiftName: String!,
      shiftTmeFrom: String!,
      shiftTimeTo: String!,
      maxShifts: Int!,
      created_by: String,
      created_at: ISODate,
    ): Shift,

    updateShift(
      id: ID!,
      shiftName: String!,
      shiftTmeFrom: String,
      shiftTimeTo: String,
      maxShifts: Int,
      permissions: PermissionsInput
      modified: [modifiedInputs]
    ): Shift,

    deleteShift( id: ID!, shiftName: String, modified: [modifiedInputs] ): Shift,
  }

  type Shift {
    _id: ID,
    shiftName: String!,
    shiftTmeFrom: String,
    shiftTimeTo: String,
    maxShifts: Int,
    created_by: String,
    created_at: ISODate,
    modified: [modifiedTypes]
  }

  input ShiftInput{
    _id: ID,
    shiftName: String!,
    shiftTmeFrom: String,
    shiftTimeTo: String,
    maxShifts: Int,
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
