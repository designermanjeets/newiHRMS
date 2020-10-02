const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
}); //,{ _id : false }

const departmentSchema = new Schema({
  department: String,
  created_at: Date,
  created_by: Date,
  modified : [subSchema]
}, {collection:'Department'});


module.exports = mongoose.model('Department', departmentSchema);
