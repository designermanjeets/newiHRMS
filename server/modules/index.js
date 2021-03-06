const { makeExecutableSchemaFromModules } = require('../utils/modules')

const auth = require('./auth')
const company = require('./company')
const holiday = require('./holiday')
const leavetype = require('./leavetype')
const designation = require('./designation')
const department = require('./department')

module.exports = makeExecutableSchemaFromModules({
  modules: [
    auth,
    company,
    holiday,
    leavetype,
    designation,
    department,
  ]
})
