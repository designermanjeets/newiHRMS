const LeaveType = require('../../../models/leaveType');
const Audit = require('../../../models/Audit');

const createLeaveType = (_, {
                            leaveType,
                            leaveDays,
                            carryForward,
                            carryMax,
                            status,
                            created_by,
                            created_at,
                            remainingLeaves
                          },{me,secret}) => new Promise(async (resolve, reject) => {
  const leave = await LeaveType.findOne({$or:[ {leaveType} ]})
  if (leave) {
    reject('LeaveType already exist');
  } else {
    remainingLeaves = leaveDays;
    const newLeaveType = await LeaveType.create({
      leaveType,
      leaveDays,
      carryForward,
      carryMax,
      status,
      created_by,
      created_at,
      remainingLeaves
    })

    const modifiedObj = {
      newLeaveType_ID: newLeaveType._id,
      action: 'Leave Type Created',
      created_by: created_by,
      created_at: created_at,
      createdLeaveType: newLeaveType
    }
    Audit.find({}).then(val => {
      if(val.length) {
        Audit.findOneAndUpdate(
          { },
          { $push: { leaveTypeAudit: modifiedObj  }  }, { new: true })
          .then();
      } else {
        Audit.create({ leaveTypeAudit: modifiedObj  })
          .then();
      }
      resolve(result);
    });

    resolve(newLeaveType);
  }
});

module.exports = createLeaveType;
