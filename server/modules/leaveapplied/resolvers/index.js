const getLeavesApplied = require('./leavesapplied')
const createLeave = require('./createleave')
const updateLeave= require('./updateleave')
const deleteLeave = require('./deleteleave')
const approveORejectLeave = require('./approverejectleave')


const resolvers = {
  Query: {
    getLeavesApplied
  },
  Mutation: {
    createLeave,
    updateLeave,
    deleteLeave,
    approveORejectLeave
  }
}

module.exports = resolvers
