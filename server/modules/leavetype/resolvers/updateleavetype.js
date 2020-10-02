const LeaveType = require('../../../models/leavetype');
const Audit = require('../../../models/Audit');

const updateLeaveType = (_, {
                            id,
                            leavetype,
                            leavedays,
                            carryforward,
                            carrymax,
                            status,
                            modified
                          },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    let param ={
      leavetype,
      leavedays,
      carryforward,
      carrymax,
      status,
    }
    console.log(param)
    const ltype = await LeaveType.findById(id);
    let changeFields = {};
    for ( item in param) {
      if(param[item] && param[item] !== ltype[item]) {
        changeFields[item] = param[item];
      }
    }
    if (!ltype) throw new Error('LeaveType not found!!')
    if(ltype) {
      await LeaveType.findByIdAndUpdate(id,{$set:{...param}},{new: true})
        .then((result) => {
          if(result && Object.keys(changeFields).length !== 0) {
            // To Update All Departments LeaveTypes: TO:DO
            const nmodified = {
              leave_ID: ltype._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Changed',
              changedObj: changeFields,
              oldLeaveTypeData: ltype
            }
            Audit.find({}).then(val =>{
              if(val.length) {
                Audit.findOneAndUpdate(
                  { },
                  { $push: { leaveTypeAudit: nmodified  }  }, { new: true }).then(
                  res => resolve(res)
                );
              } else {
                Audit.create({ leaveTypeAudit: nmodified  }, { new: true }).then(
                  res => resolve(res)
                );
              }
              resolve(result);
            });
            resolve(result);
          } else {
            resolve(result);
          }
        })
    }
  } catch(error){
    reject(error);
  }
});

module.exports = updateLeaveType;
