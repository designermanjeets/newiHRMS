const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getHolidays(query: Pagination!): [Holiday]

  }

  extend type Mutation {

    createHoliday (
      title: String,
      date: ISODate,
      day: String,
      paid: String,
      created_at: ISODate,
      created_by: String
    ): Holiday,

    updateHoliday(
      id: ID!,
      title: String,
      date: ISODate,
      day: String,
      paid: String,
      modified: [modifiedInputs]
    ): Holiday,

    deleteHoliday( id: ID!, modified: [modifiedInputs] ): Holiday,
  }

  type Holiday{
    _id: ID,
    title: String,
    date: ISODate,
    day:  String,
    paid: String,
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
