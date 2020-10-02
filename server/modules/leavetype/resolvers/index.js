const getLeaveTypes = require('./leavetypes')
const createLeaveType = require('./createleavetype')
const updateLeaveType = require('./updateleavetype')
const deleteLeaveType = require('./deleteleavetype')


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
