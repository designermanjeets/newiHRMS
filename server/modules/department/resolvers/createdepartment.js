const Department = require('../../../models/department');
const Audit = require('../../../models/Audit');

const createDepartment = (_, {
                             department,
                             created_at,
                             created_by
                           },{me,secret}) => new Promise(async (resolve, reject) => {
  const desig = await Department.findOne({$or:[ {department} ]})
  if (desig) {
    reject('Department already exist');
  } else {
    const newDepartment = await Department.create({
      department,
      created_at,
      created_by
    })
    const nmodified = {
      newDepart_ID: newDepartment._id,
      action: 'Department Created',
      created_by: created_by,
      created_at: created_at,
      createdDepartment: newDepartment
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
      resolve(result);
    });
    resolve(newDepartment);
  }
});

module.exports = createDepartment
