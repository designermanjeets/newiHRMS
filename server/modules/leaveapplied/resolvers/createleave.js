const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const createLeave = (_, {
  leaveType,
  leaveID,
  userID,
  username,
  email,
  employeeID,
  numberOfDays,
  status,
  approver,
  reason,
  created_at,
  created_by,
  from,
  to,
  remainingLeaves
},{me,secret}) => new Promise(async (resolve, reject) => {
  let params = {
    userID,
    username,
    email,
    employeeID,
    leaveType,
    leaveID,
    numberOfDays,
    status,
    approver,
    reason,
    created_at,
    created_by,
    from,
    to,
    remainingLeaves
  }
  params.status = 'pending';

  const user = await User.findById({_id: userID})
  if (!user) reject (new Error('No User Found!'))
  if (user) {
    if (!user.leaveApplied)
      user['leaveApplied'] = []; // If Done here

      let found = false;
      user.leaveApplied.forEach(l => {
      if((new Date(l.from) <= new Date(to)) && (new Date(from) <= new Date(l.to))) {
        if (l.status !== 'declined' && l.status !== 'rejected') {
          // overlapping dates
          // console.log('Overlapping);
          // console.log(l);
          found = true;
          reject(new Error(`Leave within selected time period is already exists! Choose another slot.`));
        }
      }
    });
    if (!found) {
      user.leaveApplied.push(params);

      let remn = 0;

      // Below Update User Leaves
      user.designation.leaveType.forEach(val => {
        if (val.leaveID === params.leaveID) {
          if (!val.remainingLeaves) {
            val.remainingLeaves = val.leaveDays - params.numberOfDays;
          } else {
            val.remainingLeaves = val.remainingLeaves - params.numberOfDays;
          }
          remn = val.remainingLeaves;
        }

        user.leaveApplied.forEach(va => {
          if(va.leaveID === leaveID) {
            va.remainingLeaves = remn;
          }
        });
      });

      const modified = {
        leaveID: leaveID,
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
            .then();
        } else {
          Audit.create({ leaveAppliedAudit: modified })
            .then();
        }
      });

      user.save();
    }
    resolve(user);
  }
});

module.exports = createLeave;
