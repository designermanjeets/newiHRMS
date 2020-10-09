const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Role = require('./role');

const Schema = mongoose.Schema;

const leaveTypesSchema = mongoose.Schema({
  leavetype: String,
  leave_ID: String,
  leavedays: Number,
  carryforward: String,
  carrymax: Number,
  status: String,
  remainingleaves: Number
}, { strict: false});

const leaveAppliedSchema = mongoose.Schema({
  user_ID: String,
  username: String,
  email: String,
  emmpid: String,
  leavetype: String,
  leave_ID: String,
  nofdays: Number,
  status: String,
  approvers: [
    {
      approverID: String,
      approverUserName: String
    }
  ],
  approvedBy: {
    approvedByID: String,
    approvedByUserName: String
  },
  rejectedBy: {
    rejectedByID: String,
    rejectedByUserName: String
  },
  reason: String,
  created_at: Date,
  created_by:String,
  from: Date,
  to: Date,
  remainingleaves: Number
}, { strict: false});

const designationSchema = new Schema({
  designation: String,
  department: String,
  department_ID: String,
  created_at: Date,
  created_by: String,
  leavetype: [leaveTypesSchema]
}, { strict: false});

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
}); //,{ _id : false }

const roleSchema = new Schema({
  id: String,
  role_name: String,
  mod_employee: Boolean,
  mod_holidays: Boolean,
  mod_leaves: Boolean,
  mod_events: Boolean,
  mod_jobs: Boolean,
  mod_assets: Boolean,
  permissions: {
    employees: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    holidays: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    leaves: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    events: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    jobs: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    assets: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    }
  },
  created_at: Date,
  created_by: String,
  modified : [subSchema]
}, { strict: false});

const userSchema = new Schema({
  username: {  type: String, required: true },
  email: String,
  firstname: String,
  lastname: String,
  password: String,
  role: String,
  emmpid:String,
  corporateid: String,
  mobile: String,
  joiningdate: Date,
  department: String,
  department_ID: String,
  designation: designationSchema,
  leaveApplied: [leaveAppliedSchema],
  designation_ID: String,
  created_at: Date,
  modified : [subSchema],
  Role: roleSchema,
}, { collection:'User' });


module.exports = mongoose.model('User', userSchema);
