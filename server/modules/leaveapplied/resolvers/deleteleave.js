const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const deleteLeave = (_, {
  id,
  user_ID,
  modified
},{me,secret}) => new Promise(async (resolve, reject) => {
  const user = await User.findOne(
    { $and: [ {_id: user_ID }, { 'leaveApplied._id': id} ] },
  )
  if (!user) reject (new Error('No User Leave Found!'))
  if (user) {
    if (user.leaveApplied) {

      let remn = 0;
      let lprms = {};

      user.leaveApplied.forEach((va, index) => {
        if(va._id.toHexString() === id) {
          lprms = va;
          remn = va.remainingleaves + va.nofdays;

          // Update Designation Remaining Leaves
          user.designation.leavetype.forEach(va => {
            if(va.leave_ID === lprms.leave_ID) {
              va.remainingleaves = remn;
            }
          });

          // // Loop for All
          user.leaveApplied.forEach(va => {
            if(va.leave_ID === lprms.leave_ID) {
              va.remainingleaves = remn;
            }
          });


          user.leaveApplied.splice(index, 1);
          user.save();
        }
      });

      const modifiedObj = {
        user_ID: user._id,
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

module.exports = deleteLeave;
