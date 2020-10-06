const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

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
  approver: String,
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
  permissions:{
    holiday: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    leave:{
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    assets:{
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    events:{
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    }
  },
  created_at: Date,
  modified : [subSchema],
}, { collection:'User' });


module.exports = mongoose.model('User', userSchema);
