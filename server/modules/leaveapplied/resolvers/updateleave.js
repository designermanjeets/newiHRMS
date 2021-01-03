const User = require('../../../models/user');
const Audit = require('../../../models/Audit');
const LeaveApplied = require('../../../models/leaveapplied');

const updateLeave = (_, {
  id,
  leaveTypeID,
  userID,
  numberOfDays,
  leaveStatus,
  approver,
  reason,
  leaveFrom,
  leaveTo,
  remainingLeaves,
  modified
}, { me, secret }) => new Promise(async (resolve, reject) => {
  let params = {
    numberOfDays,
    reason,
    leaveFrom,
    leaveTo,
    modified
  };

  const user = await User.findOne(
    { $and: [{ _id: userID }] }
  );

  if (!user) reject(new Error('No User Leave Found!'));
  if (user) {

    const userSpecificOverlapCheck = await LeaveApplied.findOneAndUpdate({
        $and: [
          { userID },
          { leaveTypeID },
          {
            $or: [
              { leaveFrom: { $lte: new Date(leaveFrom) }, leaveTo: { $gte: new Date(leaveTo) } },
              { leaveFrom: { $lte: new Date(leaveFrom) }, leaveTo: { $gte: new Date(leaveTo) } },
              { leaveFrom: { $gt: new Date(leaveFrom) }, leaveTo: { $lt: new Date(leaveTo) } }
            ]
          }
        ]
      },
      { $set: { ...params } }, { new: true }
    );

    if (userSpecificOverlapCheck) {

      const modifiedObj = {
        leaveID: id,
        action: 'User Leave Updated',
        modified_by: modified[0].modified_by,
        modified_at: modified[0].modified_at,
        oldLeave: { ...params, leaveStatus, leaveTypeID, userID }
      };

      Audit.find({}).then(val => {
        if (val.length) {
          Audit.findOneAndUpdate(
            {},
            { $push: { leaveAppliedAudit: modifiedObj } }, { new: true })
            .then();
        } else {
          Audit.create({ leaveAppliedAudit: modifiedObj })
            .then();
        }
      });

      resolve(userSpecificOverlapCheck);

    } else {
      reject(new Error('Update Leave Failed!'));
    }

  }
});

module.exports = updateLeave;
