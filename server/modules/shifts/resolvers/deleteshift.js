const Shift = require('../../../models/shift');
const Audit = require('../../../models/Audit');

const deleteShift = (_, { id, modified }, {me,secret}) => new Promise(async (resolve, reject) => {
  try {

    const shft = await Shift.findById(id);

    if (!shft) throw new Error('Shift not found!!')

    if(shft) {

      await Shift.findByIdAndDelete(id)
        .then((result) => {

          const modifiedObj = {
            shift_ID: shft._id,
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            action: 'Shift Deleted!',
            deletedShift: shft
          }

          Audit.find({}).then(val => {
            if(val.length) {
              Audit.findOneAndUpdate(
                { },
                { $push: { shiftAudit: modifiedObj  }  }, { new: true })
                .then((res) => resolve(res));
            } else {
              Audit.create({ shiftAudit: modifiedObj  })
                .then((res) => resolve(res));
            }
          });

          resolve(result);

        })
    }
  } catch(error){
    reject(error);
  }
});

module.exports = deleteShift;