const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
});

const SalaryHeadSchema = new Schema({
  headName: { type: String, required: true },
  headPercentage: { type: Number, required: true },
  headEmployeeShare: Number,
  headOrgShare: Number,
  headSalaryFrom: Number,
  headSalaryTo: Number,
  headActive: { type: Boolean, default: true },
  headIsDeduction: { type: Boolean, default: false, required: true },
  headIsEarning: { type: Boolean, default: false, required: true },
  modified: [subSchema]

}, { collection: 'SalaryHead' });

module.exports = mongoose.model('SalaryHead', SalaryHeadSchema);
