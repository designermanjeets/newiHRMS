const LeaveType = require('../../../models/leavetype');
const Audit = require('../../../models/Audit');

const deleteLeaveType = (_, { id, modified },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    const ltype = await LeaveType.findById(id);
    if (!ltype) throw new Error('LeaveType not found!!')
    if(ltype) {
      await LeaveType.findByIdAndDelete(id)
        .then((result) => {
          const nmodified = {
            leave_ID: ltype._id,
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            action: 'Leave Type Deleted!',
            deletedLeave: ltype
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
          });
          resolve(result);
        })
    }
  } catch(error){
    reject(error);
  }
});

module.exports = deleteLeaveType;
