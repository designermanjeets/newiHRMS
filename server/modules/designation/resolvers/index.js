const getDesignations = require('./designations')
const createDesignation = require('./createdesignations')
const updateDesignation = require('./updatedesignations')
const deleteDesignation = require('./deletedesignations')


const resolvers = {
  Query: {
    getDesignations
  },
  Mutation: {
    createDesignation,
    updateDesignation,
    deleteDesignation
  }
}

module.exports = resolvers
