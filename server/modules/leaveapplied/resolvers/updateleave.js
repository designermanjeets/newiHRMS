const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const updateLeave = (_, {
  id,
  leavetype,
  leave_ID,
  user_ID,
  username,
  email,
  emmpid,
  nofdays,
  status,
  approver,
  reason,
  created_at,
  created_by,
  from,
  to,
  remaingleaves
},{me,secret}) => new Promise(async (resolve, reject) => {
  let params = {
    user_ID,
    username,
    email,
    emmpid,
    leavetype,
    leave_ID,
    nofdays,
    status,
    approver,
    reason,
    from,
    to,
    remaingleaves
  }
  const user = await User.findOne(
      { $and: [ {_id: user_ID }, { 'leaveApplied._id': id} ] },
    )
  if (!user) reject (new Error('No User Leave Found!'))
  if (user) {
    if (user.leaveApplied) {

      user.leaveApplied.forEach(va => {
        if(va._id.toHexString() === id) {
          va.nofdays = params.nofdays;
          va.reason = params.reason;
          va.from = params.from;
          va.to = params.to;
          va.remaingleaves = params.remaingleaves;
          user.save();
        }
        if(va.leave_ID === leave_ID) {
          va.remaingleaves = params.remaingleaves;
          user.save();
        }
      });

        const modified = {
          user_ID: user._id,
          action: 'User Applied Leave',
          created_by: created_by,
          created_at: created_at,
          createdLeave: params
        }
        Audit.find({}).then(val => {
          if(val.length) {
            Audit.findOneAndUpdate(
              { },
              { $push: { leaveAppliedAudit: modified  }  }, { new: true })
              .then(res=> resolve(res));
          } else {
            Audit.create({ leaveAppliedAudit: modified }, { new: true })
              .then(res=> resolve(res));
          }
      });
    }
    resolve(user);
  }
});

module.exports = updateLeave;
