const Designation = require('../../../models/designation');
const Audit = require('../../../models/Audit');
const LeaveType = require('../../../models/leavetype');

const createDesignation = (_, {
  designation,
  department,
  department_ID,
  created_at,
  created_by,
  leavetype
},{me,secret}) => new Promise(async (resolve, reject) => {
  const desig = await Designation.findOne({$or:[ {designation} ]})
  console.log(department_ID)
  if (desig) {
    reject('Designation already exist');
  } else {
    const newDesignation = await Designation.create({
      designation,
      department,
      department_ID,
      created_at,
      created_by,
      leavetype
    }).then(val => {
      LeaveType.findById({_id: leavetype[0].leave_ID}).then( v => {
        if(v) {
          val.leavetype.forEach(lv => {
            if (lv.leave_ID ===v._id.toHexString()) {
              lv.carrymax = v.carrymax
              lv.carryforward = v.carryforward
              lv.remainingleaves = v.remainingleaves
              val.save();
            }
          })
          resolve(newDesignation);
        }
      });
    })

    const nmodified = {
      newDesig_ID: newDesignation._id,
      action: 'Designation Created',
      created_by: created_by,
      created_at: created_at,
      createdDesignation: newDesignation
    }
    Audit.find({}).then(val =>{
      if(val.length) {
        Audit.findOneAndUpdate(
          { },
          { $push: { desigAudit: nmodified  }  }, { new: true })
          .then();
      } else {
        Audit.create({ desigAudit: nmodified  })
          .then();
      }
      resolve(newDesignation);
    });
    resolve(newDesignation);
  }
});

module.exports = createDesignation
