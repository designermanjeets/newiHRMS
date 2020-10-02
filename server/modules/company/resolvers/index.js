const { getCompany, getCompanies } = require('./companies')
const createCompany = require('./createcompany')
const updateCompany = require('./editcompany')
const deleteCompany = require('./deletecompany')


const resolvers = {
  Query: {
    getCompany,
    getCompanies
  },
  Mutation: {
    createCompany,
    updateCompany,
    deleteCompany
  }
}

module.exports = resolvers
