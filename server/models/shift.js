const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
});

const shiftSchema = new Schema({
  id: String,
  shiftname: String,
  shiftimeFrom: String,
  shiftimeTo: String,
  maxshifts: Number,
  created_at: Date,
  created_by: String,
  modified : [subSchema],

}, {collection:'Shift'});

module.exports = mongoose.model('Shift', shiftSchema);
