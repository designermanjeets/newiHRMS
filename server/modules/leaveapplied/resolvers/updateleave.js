const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const updateLeave = (_, {
  id,
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
  from,
  to,
  remainingLeaves,
  modified
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
    from,
    to,
    remainingLeaves,
    modified
  }
  const user = await User.findOne(
      { $and: [ {_id: userID }, { 'leaveApplied._id': id} ] },
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

            if(va.numberOfDays < params.numberOfDays) {
              va.remainingLeaves = (va.remainingLeaves - (params.numberOfDays - va.numberOfDays))
            } else {
              va.remainingLeaves = (va.remainingLeaves + ( va.numberOfDays - params.numberOfDays))
            }
            va.numberOfDays = params.numberOfDays;
            remn = va.remainingLeaves;

            // Update Designation Remaining Leaves
            user.designation.leaveType.forEach(va => {
              if(va.leaveID === params.leaveID) {
                va.remainingLeaves = remn;
              }
            });

            // Loop for All
            user.leaveApplied.forEach(va => {
              if(va.leaveID === params.leaveID) {
                va.remainingLeaves = remn;
              }
            });

            user.save();

          }
        }
      });



      // Loop for All

      let changeFields = {};
      user.leaveApplied.forEach(va => {
        if(va.leaveID === params.leaveID) {
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
          leaveID: id,
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

module.exports = updateLeave;
