const Department = require('../../../models/department');
const Designation = require('../../../models/designation');
const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const deleteDepartment = (_, { id, modified },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    const ltype = await Department.findById(id);
    if (!ltype) throw new Error('Department not found!!')
    if(ltype) {
      await Department.findByIdAndDelete(id)
        .then((result) => {

          Designation.updateMany(
            {"departmentID": id},
            { $unset: { department: null, departmentID: null}  }, { new: true }).then();

          User.updateMany(
            {"departmentID": id},
            { $unset: { department: null, departmentID: null, designation: null}  }, { new: true }).then();

          const modifiedObj = {
            depart_ID: ltype._id,
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            action: 'Department Deleted!',
            deletedDepartment: ltype
          }
          Audit.find({}).then(val =>{
            if(val.length) {
              Audit.findOneAndUpdate(
                { },
                { $push: { departAudit: modifiedObj  }  }, { new: true })
                .then();
            } else {
              Audit.create({ departAudit: modifiedObj  })
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

module.exports = deleteDepartment
