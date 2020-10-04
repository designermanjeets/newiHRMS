const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const createLeave = (_, {
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
    created_at,
    created_by,
    from,
    to,
    remaingleaves
  }
  params.status = 'pending';

  const user = await User.findById({_id: user_ID})
  if (!user) reject (new Error('No User Found!'))
  if (user) {
    if (!user.leaveApplied)
      user['leaveApplied'] = [];

      let found = false;
      user.leaveApplied.forEach(l => {
      if((new Date(l.from) <= new Date(to)) && (new Date(from) <= new Date(l.to))) {
        //overlapping dates
        // console.log('Overlapping);
        // console.log(l);
        found = true;
        reject(new Error(`Leave within selected time period is already exists! Choose another slot.`));
      }
    });
    if (!found) {
      user.leaveApplied.push(params);

      // Below TO:DO Update User Leaves
      // user.designation.leavetype.forEach(val => {
      //   if (val._id.toHexString() === params.leave_ID) {
      //     val.remaingleaves = params.remaingleaves;
      //   }
      // });

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

      user.save();
    }
    resolve(user);
  }
});

module.exports = createLeave;
