const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const auditSchema = mongoose.Schema({
  modified_by: String,
  action: String,
  changedObj: {},
  modified_at: Date
}, {strict: false}); //,{ _id : false }

const AuditSchema = new Schema({
  userAudit : [auditSchema],
  desigAudit : [auditSchema],
  departAudit : [auditSchema],
  leaveAudit : [auditSchema],
  leaveTypeAudit : [auditSchema],
  holidayAudit : [auditSchema],
  leaveAppliedAudit : [auditSchema],
  sysParaAudit : [auditSchema],
  attendanceAudit : [auditSchema],
  shiftAudit : [auditSchema],
}, {collection:'Audit'});


module.exports = mongoose.model('Audit', AuditSchema);
