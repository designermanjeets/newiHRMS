const getLeavesApplied = require('./leavesapplied')
const createLeave = require('./createleave')
const updateLeave= require('./updateleave')
const deleteLeave = require('./deleteleave')
const approveorejectLeave = require('./approverejectleave')


const resolvers = {
  Query: {
    getLeavesApplied
  },
  Mutation: {
    createLeave,
    updateLeave,
    deleteLeave,
    approveorejectLeave
  }
}

module.exports = resolvers
