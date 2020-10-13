const getAttendances = require('./attendances')
const createAttendance = require('./createattendance')
const updateAttendance = require('./updateattendance')
const deleteAttendance = require('./deleteattendance')


const resolvers = {
  Query: {
    getAttendances
  },
  Mutation: {
    createAttendance,
    updateAttendance,
    deleteAttendance
  }
}

module.exports = resolvers
