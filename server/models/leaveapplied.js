const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
}); //,{ _id : false }

const leaveAppliedSchema = new Schema({
  reason: {
    type: String
  },
  userID: {
    type: String,
    require: true
  },
  leaveTypeID: {
    type: String,
    require: true
  },
  numberOfDays: {
    type: Number,
    require: true
  },
  leaveFrom: {
    type: Date,
    require: true
  },
  leaveTo: {
    type: Date,
    require: true
  },
  created_by: {
    type: String
  },
  leaveStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: "pending"
  },
  approvers: {
    approverID: String,
    approverUserName: String
  },
  approvedBy: {
    approvedByID: String,
    approvedByUserName: String
  },
  authorizedBy: {
    authorizedByID: String,
    authorizedByUserName: String
  },
  rejectedBy: {
    rejectedByID: String,
    rejectedByUserName: String
  },
  declinedBy: {
    declinedByID: String,
    declinedByUserName: String
  },
  modified : [subSchema],
}, { collection: 'LeaveApplied' }, {timestamps: true}, {strict: false});


module.exports = mongoose.model('LeaveApplied', leaveAppliedSchema);
