const User = require('../../../models/user');
const Audit = require('../../../models/Audit');
const LeaveApplied = require('../../../models/leaveapplied');

const approveORejectLeave = (_, {
  id,
  userID,
  reason,
  leaveTypeID,
  numberOfDays,
  leaveStatus,
  approvers,
  approvedBy,
  rejectedBy,
  authorizedBy,
  declinedBy,
  modified
},{me,secret}) => new Promise(async (resolve, reject) => {
  let params = {
    reason,
    numberOfDays,
    leaveStatus,
    approvers,
    approvedBy,
    rejectedBy,
    authorizedBy,
    declinedBy,
    modified
  }
  const user = await User.findOne(
    { $and: [ {_id: userID }] },
  )
  if (!user) reject (new Error('No User Leave Found!'))

  if (user) {

    await LeaveApplied.findByIdAndUpdate
      (id,{$set:{...params}},{new: true}).then( val => {
        if(val) {

          const modifiedObj = {
            leaveID: id,
            action: 'User Applied Leave Updated - ' + leaveStatus + '',
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            updatedLeave: params
          }

          Audit.find({}).then(val => {
            if(val.length) {
              Audit.findOneAndUpdate(
                { },
                { $push: { leaveAppliedAudit: modifiedObj  }  }, { new: true });
            } else {
              Audit.create({ leaveAppliedAudit: modifiedObj }, { new: true });
            }
          });

          resolve(val);

        } else {
          reject(new Error('Update Failed!'))
        }
    });
  }
});

module.exports = approveORejectLeave;
