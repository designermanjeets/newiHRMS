const getDepartments = require('./departments')
const createDepartment = require('./createdepartment')
const updateDepartment = require('./updatedepartment')
const deleteDepartment = require('./deletedepartment')


const resolvers = {
  Query: {
    getDepartments
  },
  Mutation: {
    createDepartment,
    updateDepartment,
    deleteDepartment
  }
}

module.exports = resolvers
