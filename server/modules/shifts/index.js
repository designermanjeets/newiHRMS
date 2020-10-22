const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getShifts(query: Pagination!): [Shift]

  }

  extend type Mutation {

    createShift (
      shiftname: String!,
      shiftimeFrom: String!,
      shiftimeTo: String!,
      maxshifts: Int!,
      created_by: String,
      created_at: ISODate,
    ): Shift,

    updateShift(
      id: ID!,
      shiftname: String!,
      shiftimeFrom: String,
      shiftimeTo: String,
      maxshifts: Int,
      permissions: PermissionsInput
      modified: [modifiedInputs]
    ): Shift,

    deleteShift( id: ID!, shiftname: String, modified: [modifiedInputs] ): Shift,
  }

  type Shift {
    _id: ID,
    shiftname: String!,
    shiftimeFrom: String,
    shiftimeTo: String,
    maxshifts: Int,
    created_by: String,
    created_at: ISODate,
    modified: [modifiedTypes]
  }

  input ShiftInput{
    _id: ID,
    shiftname: String!,
    shiftimeFrom: String,
    shiftimeTo: String,
    maxshifts: Int,
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
