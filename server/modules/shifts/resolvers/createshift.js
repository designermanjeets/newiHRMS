const Shift = require('../../../models/shift');
const Audit = require('../../../models/Audit');

const createShift = (_, {
  shiftName,
  shiftTmeFrom,
  shiftTimeTo,
  maxShifts,
  created_by,
  created_at
},{me,secret}) => new Promise(async (resolve, reject) => {

  const shift = await Shift.findOne({ "shiftName": shiftName })

  if (shift) {
    reject('Shift already exist!');
  } else {

    const newShift= await Shift.create({
      shiftName,
      shiftTmeFrom,
      shiftTimeTo,
      maxShifts,
      created_by,
      created_at
    });

    const modifiedObj = {
      newShift_ID: newShift._id,
      action: 'Shift Created',
      created_by: created_by,
      created_at: created_at,
      createdShift: newShift
    }

    Audit.find({}).then(val => {
      if(val.length) {

        Audit.findOneAndUpdate(
          { },
          { $push: { shiftAudit: modifiedObj  }  }, { new: true }).then()
      } else {
        Audit.create({ shiftAudit: modifiedObj }).then();
      }
    });
    resolve(newShift);
  }
});

module.exports = createShift;
