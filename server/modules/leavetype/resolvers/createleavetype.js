const LeaveType = require('../../../models/leavetype');
const Audit = require('../../../models/Audit');

const createLeaveType = (_, {
                            leavetype,
                            leavedays,
                            carryforward,
                            status,
                            created_by,
                            created_at
                          },{me,secret}) => new Promise(async (resolve, reject) => {
  const leave = await LeaveType.findOne({$or:[ {leavetype} ]})
  if (leave) {
    reject('LeaveType already exist');
  } else {
    const newLeaveType = await LeaveType.create({
      leavetype,
      leavedays,
      carryforward,
      status,
      created_by,
      created_at
    })

    const nmodified = {
      newDepart_ID: newLeaveType._id,
      action: 'Leave Type Created',
      created_by: created_by,
      created_at: created_at,
      createdDepartment: newLeaveType
    }
    Audit.find({}).then(val =>{
      if(val.length) {
        Audit.findOneAndUpdate(
          { },
          { $push: { leaveTypeAudit: nmodified  }  }, { new: true })
          .then((result) => {
            resolve(result);
          });
      } else {
        Audit.create({ leaveTypeAudit: nmodified  })
          .then((result) => {
            resolve(result);
          });
      }
      resolve(result);
    });

    resolve(newLeaveType);
  }
});

module.exports = createLeaveType;
