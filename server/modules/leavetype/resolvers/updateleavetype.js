const LeaveType = require('../../../models/leavetype');
const Designation = require('../../../models/designation');
const Audit = require('../../../models/Audit');

const updateLeaveType = (_, {
                            id,
                            leavetype,
                            leavedays,
                            carryforward,
                            carrymax,
                            status,
                            modified,
                            remainingleaves
                          },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    let param ={
      leavetype,
      leavedays,
      carryforward,
      carrymax,
      status,
      remainingleaves
    }
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
          if(result) {

            // Update Designation Assigned Leave Types

            Designation.find({}, function(err, des) {
              if (!err) {
                des.forEach(d => {
                  if(d.leavetype && d.leavetype.length) {
                    d.leavetype.forEach(upt => {
                      if(upt.leave_ID === id) {
                        upt.leavetype = result.leavetype;
                        upt.leavedays = result.leavedays;
                        d.save();
                      }
                    });
                  }
                });
              } else {
                throw new Error('No Designation Found!');
              }
            });

            const modifiedObj = {
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
                  { $push: { leaveTypeAudit: modifiedObj  }  }, { new: true }).then();
              } else {
                Audit.create({ leaveTypeAudit: modifiedObj  }).then();
              }
              resolve(result);
            });
            resolve(result);
          } else {
            reject(new Error('No Leave Type Found!'));
          }
        })
    }
  } catch(error){
    reject(error);
  }
});

module.exports = updateLeaveType;
