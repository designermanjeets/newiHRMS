const me = require('./me')
const login = require('./login')
const signup = require('./signup')
const { user, users } = require('./users')
const insertManyUsers = require('./insertmanyusers')
const updateUser = require('./updateuser')
const deleteUser = require('./deleteuser')
const changePassword = require('./changepassword')
const uploadFile = require('./fileupload')

const resolvers = {
  Query: {
    me,
    user,
    users,
  },
  Mutation: {
    login,
    signup,
    insertManyUsers,
    updateUser,
    deleteUser,
    changePassword,
    uploadFile
  }
}

module.exports = resolvers
