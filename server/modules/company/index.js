const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
const typeDefs = gql`
  extend type Query {

    getCompany(corporateid: String!): Company
    getCompanies(query: Pagination!): [Company]

  }

  extend type Mutation {

      createCompany (
        companyname: String,
        printname: String,
        corporateid: String,
        address1: String,
        address2: String,
        countryid: String,
        stateid: String,
        cityid: String,
        zipcode: String,
        phone: String,
        mobile: String,
        fax: String,
        email: String,
        website: String,
        financialbegindate: String,
        booksbegindate: String,
        cinno: String,
        panno: String,
        gstin: String,
        currencyid: String,
        Createdby: String,
        createdon: String,
        createdip: String,
        modifiedby: String,
        modifiedon: String,
        modifiedip: String,
        alias: String
      ): Company

      updateCompany(
        companyname: String,
        printname: String,
        corporateid: String,
        address1: String,
        address2: String,
        countryid: String,
        stateid: String,
        cityid: String,
        zipcode: String,
        phone: String,
        mobile: String,
        fax: String,
        email: String,
        website: String,
        financialbegindate: String,
        booksbegindate: String,
        cinno: String,
        panno: String,
        gstin: String,
        currencyid: String,
        Createdby: String,
        modifiedby: String,
        modifiedon: String,
        modifiedip: String,
        alias: String
      ): Company

      deleteCompany( corporateid: String ): Company
  }

  type Company {
    _id: ID!,
    companyname: String,
    printname: String,
    corporateid: String,
    address1: String,
    address2: String,
    countryid: String,
    stateid: String,
    cityid: String,
    zipcode: String,
    phone: String,
    mobile: String,
    fax: String,
    email: String,
    website: String,
    financialbegindate: String,
    booksbegindate: String,
    cinno: String,
    panno: String,
    gstin: String,
    currencyid: String,
    Createdby: String,
    createdon: String,
    createdip: String,
    modifiedby: String,
    modifiedon: String,
    modifiedip: String,
    alias: String
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
