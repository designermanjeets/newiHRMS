const LeaveType = require('../../../models/leavetype');
const Audit = require('../../../models/Audit');

const deleteLeaveType = (_, { id, modified },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    const ltype = await LeaveType.findById(id);
    if (!ltype) throw new Error('LeaveType not found!!')
    if(ltype) {
      await LeaveType.findByIdAndDelete(id)
        .then((result) => {

          // Update Designation Assigned Leave Types

          const modifiedObj = {
            leave_ID: ltype._id,
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            action: 'Leave Type Deleted!',
            deletedLeaveType: ltype
          }
          Audit.find({}).then(val =>{
            if(val.length) {
              Audit.findOneAndUpdate(
                { },
                { $push: { leaveTypeAudit: modifiedObj  }  }, { new: true })
                .then();
            } else {
              Audit.create({ leaveTypeAudit: modifiedObj  })
                .then();
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
