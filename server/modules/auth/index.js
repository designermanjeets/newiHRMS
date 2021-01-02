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
      firstname: String,
      lastname: String,
      mobile: String
      joiningDate: ISODate!
      roleID: String!
      shiftIDs: [String]
      employeeID:String!
      corporateID: String!
      departmentID: String
      designationID: String
      created_at: ISODate!
      created_by: String
      department: String,
      designation: String,
    ): User

    uploadFile(file: Upload!): [User]

    insertManyUsers(input: [UserInput]!): CreateUsersPayload

    updateUser(
      id:ID,
      username: String!,
      email: String!,
      password: String,
      firstname: String,
      lastname: String,
      employeeID:String!,
      corporateID: String,
      mobile: String,
      joiningDate: ISODate,
      departmentID: String,
      designationID: String,
      shiftIDs: [String],
      modified: [modifiedInputs]
      roleID: String,
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
    role: Role
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
    employeeID:String,
    corporateID: String,
    mobile: String,
    joiningDate: ISODate,
    departmentID: String,
    designationID: String,
    created_at: ISODate,
    created_by: String,
    modified: [modifiedTypes],
    roleID: String,
    shiftIDs: [String]
    department: String,
    designation: String,
    role: String
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
    employeeID:String,
    corporateID: String,
    departmentID: String,
    designationID: String,
    mobile: String,
    joiningDate: ISODate,
    created_at: ISODate,
    created_by: String
    Role: RoleInput
    shiftID: String
    shift: [ShiftInput]
    department: String,
    designation: String,
  }

  input modifiedInputs {
    modified_by: String
    modified_at: ISODate
  }

  input leaveTypesInputs {
    leaveType: String,
    leaveID: String,
    leaveDays: Int!,
    carryForward: String,
    status: String,
    carryMax: Int,
    remainingLeaves: Int
  },

  input designationInputs {
    _id: String,
    designation: String,
    department: String,
    departmentID: String,
    created_at: ISODate,
    created_by: String,
    leaveType: [leaveTypesInputs]
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
    departmentID: String
    designationID: String,
    department: String,
    designation: String,
    role: String
  }

  input Dates{
    gte:String,
    lt:String,
    bool:Boolean
  }

  type leaveTypes {
    leaveType: String,
    leaveID: String,
    leaveDays: Int,
    carryForward: String,
    carryMax: Int,
    status: String,
    remainingLeaves: Int
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
