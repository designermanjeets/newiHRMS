const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
});

const leaveTypeSchema = mongoose.Schema({
  leaveType: String,
  leaveID: String,
  leaveDays: Number,
  carryForward: String,
  carryMax: Number,
  status: String,
  remainingLeaves: Number
}, { strict: false});

const designationSchema = new Schema({
  designation: String,
  // department: String,
  departmentID: String,
  created_at: Date,
  created_by: String,
  modified : [subSchema],
  leaveType: [String]
}, {collection:'Designation'});


module.exports = mongoose.model('Designation', designationSchema);
