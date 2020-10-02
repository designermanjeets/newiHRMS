const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
});

const leaveTypeSchema = mongoose.Schema({
  leavetype: String,
  leave_ID: String,
  leavedays: String,
  carryforward: String,
  status: String
}, { strict: false});

const designationSchema = new Schema({
  designation: String,
  department: String,
  department_ID: String,
  created_at: Date,
  created_by: String,
  modified : [subSchema],
  leavetype: [leaveTypeSchema]
}, {collection:'Designation'});


module.exports = mongoose.model('Designation', designationSchema);
