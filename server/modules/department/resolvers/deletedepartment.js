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
            {"department_ID": id},
            { $unset: { department: null, department_ID: null}  }, { new: true }).then();

          User.updateMany(
            {"department_ID": id},
            { $unset: { department: null, department_ID: null, designation: null}  }, { new: true }).then();

          const nmodified = {
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
                { $push: { departAudit: nmodified  }  }, { new: true })
                .then((result) => {
                  resolve(result);
                });
            } else {
              Audit.create({ departAudit: nmodified  })
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

module.exports = deleteDepartment
