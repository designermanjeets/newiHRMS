const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
}); //,{ _id : false }

const LeaveTypeSchema = new Schema({
  id: String,
  leavetype: String,
  leavedays: String,
  carryforward: String,
  status: String,
  created_at: Date,
  created_by: String,
  modified : [subSchema],
}, {collection:'LeaveType'});

module.exports = mongoose.model('LeaveType', LeaveTypeSchema);
