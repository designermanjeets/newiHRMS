const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
}); //,{ _id : false }

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  firstname: { type: String },
  lastname: { type: String },
  password: { type: String, required: true },
  roleID: { type: String, required: true },
  employeeID: { type: String, required: true },
  corporateID: { type: String, required: true },
  shiftIDs: [String],
  designationID: String,
  departmentID: String,
  mobile: String,
  joiningDate: { type: Date, required: true },
  created_at: { type: Date, required: true },
  created_by: { type: String },
  modified: [subSchema],
  department: String,
  designation: String,
}, { collection: 'User' });


module.exports = mongoose.model('User', userSchema);
