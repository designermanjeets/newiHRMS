const LeaveType = require('../../../models/leavetype');
const Audit = require('../../../models/Audit');

const createLeaveType = (_, {
                            leavetype,
                            leavedays,
                            carryforward,
                            carrymax,
                            status,
                            created_by,
                            created_at,
                            remainingleaves
                          },{me,secret}) => new Promise(async (resolve, reject) => {
  const leave = await LeaveType.findOne({$or:[ {leavetype} ]})
  if (leave) {
    reject('LeaveType already exist');
  } else {
    remainingleaves = leavedays;
    const newLeaveType = await LeaveType.create({
      leavetype,
      leavedays,
      carryforward,
      carrymax,
      status,
      created_by,
      created_at,
      remainingleaves
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
