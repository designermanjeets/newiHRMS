const DateTime = require('./date-time')
const FileUpload = require('./file-upload')

module.exports = {
  typeDefs: [
    DateTime.typeDef,
    FileUpload.typeDef
  ],
  resolvers: {
    ...DateTime.resolvers,
    ...FileUpload.resolvers
  }
}
