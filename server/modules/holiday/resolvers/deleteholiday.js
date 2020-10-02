const Holiday = require('../../../models/holiday');
const Audit = require('../../../models/Audit');

const deleteHoliday = (_, { id, modified },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    const comp = await Holiday.findById(id);
    if (!comp) throw new Error('Holiday not found!!')
    if(comp) {
      await Holiday.findByIdAndDelete(id)
        .then((result) => {
          const nmodified = {
            holiday_ID: comp._id,
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            action: 'Holiday Deleted!',
            deletedHoliday: comp
          }
          Audit.find({}).then(val =>{
            if(val.length) {
              Audit.findOneAndUpdate(
                { },
                { $push: { holidayAudit: nmodified  }  }, { new: true })
                .then((res) => resolve(res));
            } else {
              Audit.create({ leaveAudit: nmodified  }, { new: true })
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

module.exports = deleteHoliday;
