const getLeaveTypes = require('./leaveTypes')
const createLeaveType = require('./createleaveType')
const updateLeaveType = require('./updateleaveType')
const deleteLeaveType = require('./deleteleaveType')


const resolvers = {
  Query: {
    getLeaveTypes
  },
  Mutation: {
    createLeaveType,
    updateLeaveType,
    deleteLeaveType
  }
}

module.exports = resolvers
