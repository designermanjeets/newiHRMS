const { gql } = require('apollo-server-express')

// The schema (feel free to split these in a sub folder if you'd like)
// @isAuthenticated directive to Authenticate
const typeDefs = gql`
  extend type Query {
    me: User @isAuthenticated
    user(email: String!): User
    users(query: Pagination!): [User]
  }

  extend type Mutation {
    login(
      email: String!,
      password: String!
    ): AuthData

    signup(
      username: String!,
      email: String!,
      password: String!,
      role: String,
      firstname: String,
      lastname: String,
      role: String,
      emmpid:String!,
      corporateid: String!,
      mobile: String,
      joiningdate: ISODate,
      department: String,
      department_ID: String,
      designation: designationInputs,
      designation_ID: String,
      created_by: String,
      created_at: ISODate
    ): User

    uploadFile(file: Upload!): [User]

    insertManyUsers(input: [UserInput]!): CreateUsersPayload

    updateUser(
      id:ID,
      username: String!,
      email: String,
      password: String,
      firstname: String,
      lastname: String,
      role: String,
      emmpid:String,
      corporateid: String,
      mobile: String,
      joiningdate: ISODate,
      department: String,
      department_ID: String,
      designation: designationInputs,
      designation_ID: String,
      modified: [modifiedInputs]
      ): User

      deleteUser (email: String!, modified: [modifiedInputs]): User,

      changePassword (
        id: ID!,
        oldPassword: String!,
        newPassword: String!,
        email: String!
      ): ChangePasswordUser,

  }

  type CreateUsersPayload {
    users: [User]
  }

  type AuthData {
    user: User
    token: String!
    tokenExpiration: String!
  }

  type User {
    _id: ID,
    username: String,
    email: String,
    firstname: String,
    lastname: String,
    password: String,
    role: String,
    emmpid:String,
    corporateid: String,
    mobile: String,
    joiningdate: ISODate,
    department: String,
    department_ID: String,
    designation: Designation,
    designation_ID: String,
    created_at: ISODate,
    created_by: String,
    modified: [modifiedTypes]
  }

  type ChangePasswordUser{
    _id: ID!
    oldPassword:String,
    newPassword:String,
    email: String,
    user:User
  }

  type File {
    id: ID!
    path: String
    filename: String
    mimetype: String
  }

  input UserInput {
    _id: ID,
    username: String,
    email: String,
    firstname: String,
    lastname: String,
    password: String,
    role: String,
    emmpid:String,
    corporateid: String,
    department: String,
    department_ID: String,
    designation: designationInputs,
    designation_ID: String,
    mobile: String,
    joiningdate: ISODate,
    created_at: ISODate,
    created_by: String
  }

  input modifiedInputs {
    modified_by: String
    modified_at: ISODate
  }

  input leaveTypesInputs {
    leavetype: String,
    leave_ID: String,
    leavedays: Int!,
    carryforward: String,
    status: String,
    carrymax: Int,
    remainingleaves: Int
  },

  input designationInputs {
    _id: String,
    designation: String,
    department: String,
    department_ID: String,
    created_at: ISODate,
    created_by: String,
    leavetype: [leaveTypesInputs]
  }

  input Pagination {
    id: ID,
    query:String,
    argument:String
    offset: Int,
    limit: Int,
    sortBy:String,
    descending:Int,
    search:String
    dates:Dates,
    department_ID: String
    designation_ID: String,
  }

  input Dates{
    gte:String,
    lt:String,
    bool:Boolean
  }

  type leavetypes {
    leavetype: String,
    leave_ID: String,
    leavedays: Int,
    carryforward: String,
    carrymax: Int,
    status: String,
    remainingleaves: Int
  },

  type permissions {
    employees:PermissInput,
    holidays:PermissInput,
    leaves:PermissInput,
    events:PermissInput,
    jobs:PermissInput,
    assets:PermissInput
  }
  type modifiedTypes {
    modified_at: ISODate,
    modified_by: String
  }
  input PermissionsInput {
    employees:permiss,
    holidays:permiss,
    leaves:permiss,
    events:permiss,
    jobs:permiss,
    assets:permiss
  }
  type PermissInput {
    read: Boolean,
    write: Boolean,
    create: Boolean,
    delete: Boolean,
    import: Boolean,
    export: Boolean
  }
  input permiss {
    read: Boolean,
    write: Boolean,
    create: Boolean,
    delete: Boolean,
    import: Boolean,
    export: Boolean
  }
  scalar ISODate
`

const resolvers = require('./resolvers')

module.exports = {
  // typeDefs is an array, because it should be possible to split your schema if the schema grows to big, you can just export multiple here
  typeDefs: [
    typeDefs
  ],
  resolvers
}
