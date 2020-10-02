const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  modified_by: String,
  action: String,
  changedObj: {},
  modified_at: Date
}, {strict: false}); //,{ _id : false }

const userSchema = new Schema({
  userAudit : [auditSchema],
  desigAudit : [auditSchema],
  departAudit : [auditSchema],
  leaveAudit : [auditSchema],
  leaveTypeAudit : [auditSchema],
  holidayAudit : [auditSchema],
}, {collection:'Audit'});


module.exports = mongoose.model('Audit', userSchema);
