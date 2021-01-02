const Designation = require('../../../models/designation');
const Audit = require('../../../models/Audit');
const LeaveType = require('../../../models/leaveType');

const createDesignation = (_, {
  designation,
  departmentID,
  created_at,
  created_by,
  leaveType
},{me,secret}) => new Promise(async (resolve, reject) => {
  const desig = await Designation.findOne({$or:[ {designation} ]})
  console.log(departmentID)
  if (desig) {
    reject('Designation already exist');
  } else {
    Designation.create({
      designation,
      departmentID,
      created_at,
      created_by,
      leaveType
    }).then(designation => {
      // leaveType && leaveType[0] && LeaveType.findById({_id: leaveType[0].leaveID}).then( v => {
      //   if(v) {
      //     val.leaveType.forEach(lv => {
      //       if (lv.leaveID ===v._id.toHexString()) {
      //         lv.carryMax = v.carryMax
      //         lv.carryForward = v.carryForward
      //         lv.remainingLeaves = v.remainingLeaves
      //         val.save();
      //       }
      //     })
      //     resolve(newDesignation);
      //   }
      // });

      if(designation) {

        const modifiedObj = {
          newDesignation_ID: designation._id,
          action: 'Designation Created',
          created_by: created_by,
          created_at: created_at,
          createdDesignation: designation
        }

        Audit.find({}).then(val => {
          if(val.length) {
            Audit.findOneAndUpdate(
              { },
              { $push: { designationAudit: modifiedObj  }  }, { new: true })
              .then();
          } else {
            Audit.create({ designationAudit: modifiedObj  })
              .then();
          }
        });
      }
      resolve(designation);
    })
  }
});

module.exports = createDesignation
