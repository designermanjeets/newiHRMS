const getHolidays = require('./holidays')
const createHoliday = require('./createholiday')
const updateHoliday = require('./updateholiday')
const deleteHoliday = require('./deleteholiday')


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
