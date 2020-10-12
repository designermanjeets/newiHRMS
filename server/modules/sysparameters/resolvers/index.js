const getSysparameters = require('./sysparameters')
const createOrUpdateSysparameters = require('./createsysparameter')
const deleteSysparameter = require('./deletesysparameter')


const resolvers = {
  Query: {
    getSysparameters
  },
  Mutation: {
    createOrUpdateSysparameters,
    deleteSysparameter
  }
}

module.exports = resolvers
