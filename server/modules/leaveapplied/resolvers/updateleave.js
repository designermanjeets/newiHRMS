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
  from,
  to,
  remainingleaves,
  modified
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
    remainingleaves,
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


        if((new Date(va.from) <= new Date(to)) && (new Date(from) <= new Date(va.to))) {
          if (va.status !== 'declined' && va.status !== 'rejected') {
            // overlapping dates
            // console.log('Overlapping);
            // console.log(l);
            found = true;
            reject(new Error(`Leave within selected time period is already exists! Choose another slot.`));
          }
        }

        if (!found) {

          if(va._id.toHexString() === id) {
            va.reason = params.reason;
            va.from = params.from;
            va.to = params.to;

            if(va.nofdays < params.nofdays) {
              va.remainingleaves = (va.remainingleaves - (params.nofdays - va.nofdays))
            } else {
              va.remainingleaves = (va.remainingleaves + ( va.nofdays - params.nofdays))
            }
            va.nofdays = params.nofdays;
            remn = va.remainingleaves;

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

            user.save();

          }
        }
      });



      // Loop for All

      let changeFields = {};
      user.leaveApplied.forEach(va => {
        if(va.leave_ID === params.leave_ID) {
          for ( let item in params) {
            if(params[item] && params[item] !== va[item]) {
              changeFields[item] = params[item];
              if(item === 'date') {
                if(JSON.stringify(params[item]) !== JSON.stringify(va[item])) {
                  changeFields[item] = params[item];
                } else {
                  delete changeFields['date']
                }
              }
            }
          }
        }
      });

        const modifiedObj = {
          leave_ID: id,
          action: 'User Leave Updated',
          modified_by: modified[0].modified_by,
          modified_at: modified[0].modified_at,
          changedObj: changeFields,
          oldLeave: params
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

module.exports = updateLeave;
