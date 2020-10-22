const getShifts = require('./shifts')
const createShift = require('./createshift')
const updateShift = require('./updateshift')
const deleteShift = require('./deleteshift')


const resolvers = {
  Query: {
    getShifts
  },
  Mutation: {
    createShift,
    updateShift,
    deleteShift
  }
}

module.exports = resolvers
