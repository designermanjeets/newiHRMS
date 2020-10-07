const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const approveorejectLeave = (_, {
  id,
  user_ID,
  leavetype,
  leave_ID,
  nofdays,
  status,
  approvers,
  approvedBy,
  rejectedBy,
  modified
},{me,secret}) => new Promise(async (resolve, reject) => {
  let params = {
    user_ID,
    leavetype,
    leave_ID,
    nofdays,
    status,
    approvers,
    approvedBy,
    rejectedBy,
    modified
  }
  const user = await User.findOne(
    { $and: [ {_id: user_ID }, { 'leaveApplied._id': id} ] },
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
          if(status === 'rejected' && params.rejectedBy && params.rejectedBy.rejectedByID) {
            // Rejected By Details
            if (!va.rejectedBy) va.rejectedBy = {};
            va.rejectedBy.rejectedByID =  params.rejectedBy.rejectedByID
            va.rejectedBy.rejectedByUserName =  params.rejectedBy.rejectedByUserName

            va.remainingleaves = va.remainingleaves + params.nofdays; // Increase because Rejected
            remn = va.remainingleaves;
            va.status =  params.status

            // Update Designation Remaining Leaves
            user.designation.leavetype.forEach(va => {
              if(va.leave_ID === params.leave_ID) {
                va.remainingleaves = remn;
              }
            });

            // Loop for All
            user.leaveApplied.forEach(va => {
              if(va.leave_ID === params.leave_ID) {
                va.remainingleaves = remn;
              }
            });

          }

          user.save(); // Later
        }
      });

      const modifiedObj = {
        leave_ID: id,
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
