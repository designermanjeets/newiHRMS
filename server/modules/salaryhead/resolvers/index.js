const getSalaryHeads = require('./salaryheads')
const createSalaryHead = require('./createsalaryhead')
const updateSalaryHead = require('./updatesalaryhead')
const deleteSalaryHead = require('./deletesalaryhead')


const resolvers = {
  Query: {
    getSalaryHeads
  },
  Mutation: {
    createSalaryHead,
    updateSalaryHead,
    deleteSalaryHead
  }
}

module.exports = resolvers
