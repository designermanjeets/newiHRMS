const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getSysparameters(query: Pagination!): [SysParameters]

  }

  extend type Mutation {

    createOrUpdateSysparameters (
      sysparams: [sysparamsInput]
    ): SysParameters

    updateSysparameters(
      _id: ID,
      sysparams: [sysparamsInput]
    ): SysParameters

    deleteSysparameter( id: ID!, sysparams: [sysparamsInput]! ): SysParameters,
  }

  type SysParameters{
    _id: ID,
    sysparams: [sysparamsTypes]
  }

  type sysparamsTypes {
    sysparaname: String
    sysparavalue: String
    created_at: ISODate,
    created_by: String,
    modified: [modifiedTypes]
  }

  input sysparamsInput {
    sysparaname: String
    sysparavalue: String
    created_at: ISODate,
    created_by: String,
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
