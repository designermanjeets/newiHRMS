const { makeExecutableSchemaFromModules } = require('../utils/modules')

const auth = require('./auth')
const company = require('./company')
const holiday = require('./holiday')
const leaveType = require('./leaveType')
const designation = require('./designation')
const department = require('./department')
const leaveapplied = require('./leaveapplied')
const roles = require('./roles')
const parameters = require('./sysparameters')
const attendances = require('./attendance')
const shifts = require('./shifts')

module.exports = makeExecutableSchemaFromModules({
  modules: [
    auth,
    company,
    holiday,
    leaveType,
    designation,
    department,
    leaveapplied,
    roles,
    parameters,
    attendances,
    shifts
  ]
})
