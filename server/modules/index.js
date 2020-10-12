const { makeExecutableSchemaFromModules } = require('../utils/modules')

const auth = require('./auth')
const company = require('./company')
const holiday = require('./holiday')
const leavetype = require('./leavetype')
const designation = require('./designation')
const department = require('./department')
const leaveapplied = require('./leaveapplied')
const roles = require('./roles')
const parameters = require('./sysparameters')

module.exports = makeExecutableSchemaFromModules({
  modules: [
    auth,
    company,
    holiday,
    leavetype,
    designation,
    department,
    leaveapplied,
    roles,
    parameters
  ]
})
