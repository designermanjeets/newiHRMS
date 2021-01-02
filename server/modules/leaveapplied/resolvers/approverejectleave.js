const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const approveorejectLeave = (_, {
  id,
  userID,
  leaveType,
  leaveID,
  numberOfDays,
  status,
  approvers,
  approvedBy,
  rejectedBy,
  authorizedBy,
  declinedBy,
  modified
},{me,secret}) => new Promise(async (resolve, reject) => {
  let params = {
    userID,
    leaveType,
    leaveID,
    numberOfDays,
    status,
    approvers,
    approvedBy,
    rejectedBy,
    authorizedBy,
    declinedBy,
    modified
  }
  const user = await User.findOne(
    { $and: [ {_id: userID }, { 'leaveApplied._id': id} ] },
  )
  if (!user) reject (new Error('No User Leave Found!'))
  if (user) {
    if (user.leaveApplied) {

      let remn = 0;

      user.leaveApplied.forEach(va => {
        if(va._id.toHexString() === id) {

          if(status === 'approved' && params.approvedBy && params.approvedBy.approvedByID) {
            // Approved By Details
            if (!va.approvedBy) va.approvedBy = {};
            va.approvedBy.approvedByID =  params.approvedBy.approvedByID
            va.approvedBy.approvedByUserName =  params.approvedBy.approvedByUserName
            va.status =  params.status
          }
          if(status === 'authorized' && params.authorizedBy && params.authorizedBy.authorizedByID) {
            // Authorized By Details
            if (!va.authorizedBy) va.authorizedBy = {};
            va.authorizedBy.authorizedByID =  params.authorizedBy.authorizedByID
            va.authorizedBy.authorizedByUserName =  params.authorizedBy.authorizedByUserName
            va.status =  params.status
          }
          if(status === 'rejected' && params.rejectedBy && params.rejectedBy.rejectedByID) {
            // Rejected By Details
            if (!va.rejectedBy) va.rejectedBy = {};
            va.rejectedBy.rejectedByID =  params.rejectedBy.rejectedByID
            va.rejectedBy.rejectedByUserName =  params.rejectedBy.rejectedByUserName

            va.remainingLeaves = va.remainingLeaves + params.numberOfDays; // Increase because Rejected
            remn = va.remainingLeaves;
            va.status =  params.status

            // Update Designation Remaining Leaves
            user.designation.leaveType.forEach(va => {
              if(va.leaveID === params.leaveID) {
                va.remainingLeaves = remn;
              }
            });

            // Loop for All
            user.leaveApplied.forEach(va => {
              if(va.leaveID === params.leaveID) {
                va.remainingLeaves = remn;
              }
            });

          }

          if(status === 'declined' && params.declinedBy && params.declinedBy.declinedByID) {
            // Rejected By Details
            if (!va.declinedBy) va.declinedBy = {};
            va.declinedBy.declinedByID =  params.declinedBy.declinedByID
            va.declinedBy.declinedByUserName =  params.declinedBy.declinedByUserName

            va.remainingLeaves = va.remainingLeaves + params.numberOfDays; // Increase because Rejected
            remn = va.remainingLeaves;
            va.status =  params.status

            // Update Designation Remaining Leaves
            user.designation.leaveType.forEach(va => {
              if(va.leaveID === params.leaveID) {
                va.remainingLeaves = remn;
              }
            });

            // Loop for All
            user.leaveApplied.forEach(va => {
              if(va.leaveID === params.leaveID) {
                va.remainingLeaves = remn;
              }
            });

          }

          user.save(); // Later
        }
      });

      const modifiedObj = {
        leaveID: id,
        action: 'User Applied Leave Updated - ' + status + '',
        modified_by: modified[0].modified_by,
        modified_at: modified[0].modified_at,
        updatedLeave: params
      }
      Audit.find({}).then(val => {
        if(val.length) {
          Audit.findOneAndUpdate(
            { },
            { $push: { leaveAppliedAudit: modifiedObj  }  }, { new: true })
            .then(res=> resolve(res));
        } else {
          Audit.create({ leaveAppliedAudit: modifiedObj }, { new: true })
            .then(res=> resolve(res));
        }
      });
    }
    resolve(user);
  }
});

module.exports = approveorejectLeave;
