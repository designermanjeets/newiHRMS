const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
}); //,{ _id : false }

const holidaySchema = new Schema({
  id: String,
  title: String,
  date: Date,
  day: String,
  paid: String,
  created_at: Date,
  created_by: String,
  modified : [subSchema],

}, {collection:'Holiday'});

module.exports = mongoose.model('Holiday', holidaySchema);
