const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getSalaryHeads(query: Pagination!): [SalaryHead]

  }

  extend type Mutation {

    createSalaryHead (
      headName: String!
      headPercentage: Int!
      headEmployeeShare: Int
      headOrgShare: Int
      headSalaryFrom: Int
      headSalaryTo: Int
      headActive: Boolean
      created_by: String
      created_at: ISODate
      headIsDeduction: Boolean!
      headIsEarning: Boolean!
    ): SalaryHead,

    updateSalaryHead (
      id: ID!,
      headName: String!
      headPercentage: Int!
      headEmployeeShare: Int
      headOrgShare: Int
      headSalaryFrom: Int
      headSalaryTo: Int
      headActive: Boolean
      headIsDeduction: Boolean!
      headIsEarning: Boolean!
      modified: [modifiedInputs]
    ): SalaryHead,

    deleteSalaryHead ( id: ID!, headName: String!, modified: [modifiedInputs] ): SalaryHead,
  }

  type SalaryHead {
    _id: ID,
    headName: String!
    headPercentage: Int!
    headEmployeeShare: Int
    headOrgShare: Int
    headSalaryFrom: Int
    headSalaryTo: Int
    headActive: Boolean
    created_by: String
    created_at: ISODate
    headIsDeduction: Boolean!
    headIsEarning: Boolean!
    modified: [modifiedTypes]
  }


  input SalaryHeadInput {
    _id: ID,
    headName: String!
    headPercentage: Int!
    headEmployeeShare: Int
    headOrgShare: Int
    headSalaryFrom: Int
    headSalaryTo: Int
    headActive: Boolean
    created_by: String
    created_at: ISODate
    headIsDeduction: Boolean!
    headIsEarning: Boolean!
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
