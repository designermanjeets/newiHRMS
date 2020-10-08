const getRoles = require('./roles')
const createRole = require('./createrole')
const updateRole = require('./updaterole')
const deleteRole = require('./deleterole')


const resolvers = {
  Query: {
    getRoles
  },
  Mutation: {
    createRole,
    updateRole,
    deleteRole
  }
}

module.exports = resolvers
