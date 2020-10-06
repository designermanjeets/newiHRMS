const getLeavesApplied = require('./leavesapplied')
const createLeave = require('./createleave')
const updateLeave= require('./updateleave')
const deleteLeave = require('./deleteleave')


const resolvers = {
  Query: {
    getLeavesApplied
  },
  Mutation: {
    createLeave,
    updateLeave,
    deleteLeave
  }
}

module.exports = resolvers
