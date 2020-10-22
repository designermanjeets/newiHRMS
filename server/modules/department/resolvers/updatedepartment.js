const Department = require('../../../models/department');
const Designation = require('../../../models/designation');
const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const updateDepartment = (_, {
                             id,
                             department,
                             modified,
                           },{me,secret}) => new Promise(async (resolve, reject) => {
  const dtype = await Department.findById(id);
  try{
    let param = { department }
    let changeFields = {};
    for ( item in param) {
      if(param[item] && param[item] !== dtype[item]) {
        changeFields[item] = param[item];
      }
    }
    const ltype = await Department.findById(id);
    if (!ltype) throw new Error('Department not found!!')
    if(ltype) {
      await Department.findByIdAndUpdate(id,{$set:{...param}, $push: { 'modified': modified  }  },{new: true})
        .then((result) => {
          if(result && Object.keys(changeFields).length !== 0) {

            Designation.updateMany(
              {"department_ID": id},
              { $set: { department: department}  }, { new: true }).then();

            User.updateMany(
              {"department_ID": id},
              { $set: { department: department}  }, { new: true }).then();

            const modifiedObj = {
              depart_ID: dtype._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Changed',
              changedObj: changeFields,
              oldDepartData: dtype
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

module.exports = updateDepartment
