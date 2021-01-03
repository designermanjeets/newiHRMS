const { getAttendances } = require('./attendances')
const createAttendance  = require('./createattendance')
const updateAttendance = require('./updateattendance')
const deleteAttendance = require('./deleteattendance')
const uploadAttendanceFile = require('./uploadattendance')
const insertManyAttendances = require('./insertmanyattendances')


const resolvers = {
  Query: {
    getAttendances,
  },
  Mutation: {
    createAttendance,
    updateAttendance,
    deleteAttendance,
    uploadAttendanceFile,
    insertManyAttendances
  }
}

module.exports = resolvers
