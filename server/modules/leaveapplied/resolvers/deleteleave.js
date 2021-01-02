const User = require('../../../models/user');
const Audit = require('../../../models/Audit');
const LeaveApplied = require('../../../models/leaveapplied');

const deleteLeave = (_, {
  id,
  userID,
  modified,
  leaveStatus
},{me,secret}) => new Promise(async (resolve, reject) => {

  const user = await User.findOne(
    { $and: [ {_id: userID } ] },
  )
  if (!user) reject (new Error('No User Leave Found!'))
  if (user) {
    await LeaveApplied.findByIdAndDelete(id)
      .then((result) => {
        const modifiedObj = {
          userID: userID,
          action: 'Leave Deleted for User',
          modified_by: modified[0].modified_by,
          modified_at: modified[0].modified_at,
          deletedLeave: { id, userID, modified, leaveStatus }
        }
        Audit.find({}).then(val => {
          if(val.length) {
            Audit.findOneAndUpdate(
              { },
              { $push: { leaveAppliedAudit: modifiedObj  }  }, { new: true });
          } else {
            Audit.create({ leaveAppliedAudit: modifiedObj });
          }
        });
        resolve(result);
      });
  }
});

module.exports = deleteLeave;
