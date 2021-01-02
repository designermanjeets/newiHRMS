const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const deleteLeave = (_, {
  id,
  userID,
  modified,
  status
},{me,secret}) => new Promise(async (resolve, reject) => {
  const user = await User.findOne(
    { $and: [ {_id: userID }, { 'leaveApplied._id': id} ] },
  )
  if (!user) reject (new Error('No User Leave Found!'))
  if (user) {
    if (user.leaveApplied) {

      let remn = 0;
      let lprms = {};

      user.leaveApplied.forEach((va, index) => {
        if(va._id.toHexString() === id) {
          lprms = va;

          if(status !== 'rejected') {
            remn = va.remainingLeaves + va.numberOfDays;
          } else {
            remn = va.remainingLeaves
          }

          // Update Designation Remaining Leaves
          user.designation.leaveType.forEach(va => {
            if(va.leaveID === lprms.leaveID) {
              va.remainingLeaves = remn;
            }
          });

          // // Loop for All
          user.leaveApplied.forEach(va => {
            if(va.leaveID === lprms.leaveID) {
              va.remainingLeaves = remn;
            }
          });


          user.leaveApplied.splice(index, 1);
          user.save();
        }
      });

      const modifiedObj = {
        userID: user._id,
        action: 'Leave Deleted for User',
        modified_by: modified[0].modified_by,
        modified_at: modified[0].modified_at,
        deletedLeaveForUser: user // Pending
      }
      Audit.find({}).then(val => {
        if(val.length) {
          Audit.findOneAndUpdate(
            { },
            { $push: { leaveAppliedAudit: modifiedObj  }  }, { new: true })
            .then();
        } else {
          Audit.create({ leaveAppliedAudit: modifiedObj })
            .then();
        }
      });
    }
    resolve(user);
  }
});

module.exports = deleteLeave;
