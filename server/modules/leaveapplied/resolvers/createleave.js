const User = require('../../../models/user');
const Audit = require('../../../models/Audit');
const LeaveApplied = require('../../../models/leaveapplied');

const createLeave = (_, {
  leaveTypeID,
  userID,
  numberOfDays,
  leaveStatus,
  reason,
  created_by,
  leaveFrom,
  leaveTo
}, { me, secret }) => new Promise(async (resolve, reject) => {
  let params = {
    userID,
    leaveTypeID,
    numberOfDays,
    leaveStatus,
    reason,
    created_by,
    leaveFrom,
    leaveTo
  };

  const user = await User.findById({ _id: userID });

  if (!user) reject(new Error('No User Found!'));

  if (user) {

    const userSpecificOverlapCheck = await LeaveApplied.find({
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
      }
    );

    if (!userSpecificOverlapCheck || !userSpecificOverlapCheck.length) {
      const newLeaveApplied = await LeaveApplied.create({ ...params });

      const modified = {
        leaveTypeID: leaveTypeID,
        action: 'User Applied Leave',
        created_by: created_by,
        created_at: Date.now(),
        createdLeave: newLeaveApplied
      };

      Audit.find({}).then(val => {
        if (val.length) {
          Audit.findOneAndUpdate(
            {},
            { $push: { leaveAppliedAudit: modified } }, { new: true });
        } else {
          Audit.create({ leaveAppliedAudit: modified });
        }
      });

      resolve(newLeaveApplied);
    } else {
      reject(new Error('Overlapping Leave!'));
    }
  }
});

module.exports = createLeave;
