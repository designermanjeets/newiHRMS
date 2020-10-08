const getHolidays = require('./roles')
const createHoliday = require('./createholiday')
const updateHoliday = require('./updaterole')
const deleteHoliday = require('./deleterole')


const resolvers = {
  Query: {
    getHolidays
  },
  Mutation: {
    createHoliday,
    updateHoliday,
    deleteHoliday
  }
}

module.exports = resolvers
