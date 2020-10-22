const Shift = require('../../../models/shift');
const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const updateShift = (_, {
  id,
  shiftname,
  shiftimeFrom,
  shiftimeTo,
  maxshifts,
  modified
}, {me,secret}) => new Promise(async (resolve, reject) => {
  try{

    let param = {
      shiftname,
      shiftimeFrom,
      shiftimeTo,
      maxshifts,
    }

    const shft = await Shift.findById(id);

    let changeFields = {};

    for ( item in param) {
      if(param[item] && param[item] !== shft[item]) {
        changeFields[item] = param[item];
        if(item === 'date') {
          if(JSON.stringify(param[item]) !== JSON.stringify(shft[item])) {
            changeFields[item] = param[item];
          } else {
            delete changeFields['date']
          }
        }
      }
    }
    if (!shft) return new Error('Shift not found!!')
    if(shft) {

      const updatedShift = await Shift.findByIdAndUpdate(id,
        {$set:{ ...param}},
        {new: true}).then(result => {
          updateresr(result, changeFields, modified, shft);
          resolve(result);
        })

    }
  } catch(error){
    reject(error);
  }
});

const updateresr = function(result, changeFields, modified, shft) {

  User.find(
    { shift : { "$elemMatch" : { _id :result._id} } },
  ).then( res => {
    res.forEach(usr => {
      usr.shift.forEach(syft => {
        if(syft._id.toHexString() === result._id.toHexString()) {
          syft.shiftname = result.shiftname;
          syft.shiftimeFrom = result.shiftimeFrom;
          syft.shiftimeTo = result.shiftimeTo;
          syft.maxshifts = result.maxshifts;
          usr.save()
        }
      })
    })
  })

  if(result && Object.keys(changeFields).length !== 0) {

    const modifiedObj = {
      shift_ID: shft._id,
      modified_by: modified[0].modified_by,
      modified_at: modified[0].modified_at,
      action: 'Changed',
      changedObj: changeFields,
      oldShiftData: shft
    }
    Audit.find({}).then(val =>{
      if(val.length) {
        Audit.findOneAndUpdate(
          { },
          { $push: { shiftAudit: modifiedObj  }  }, { new: true }).then()
      } else {
        Audit.create({ shiftAudit: modifiedObj  }).then()
      }
    });
  }
}

module.exports = updateShift;
