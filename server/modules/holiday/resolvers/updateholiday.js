const Holiday = require('../../../models/holiday');
const Audit = require('../../../models/Audit');

const updateHoliday = (_, {
                          id,
                          title,
                          date,
                          day,
                          paid,
                          modified
                        },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    let param ={
      title,
      date,
      day,
      paid,
    }
    const holi = await Holiday.findById(id);
    let changeFields = {};
    for ( item in param) {
      if(param[item] && param[item] !== holi[item]) {
        changeFields[item] = param[item];
        if(item === 'date') {
          if(JSON.stringify(param[item]) !== JSON.stringify(holi[item])) {
            changeFields[item] = param[item];
          } else {
            delete changeFields['date']
          }
        }
      }
    }
    if (!holi) throw new Error('Holiday not found!!')
    if(holi) {
      await Holiday.findByIdAndUpdate(id,{$set:{...param}},{new: true})
        .then((result) => {
          if(result && Object.keys(changeFields).length !== 0) {
            // To Update All Departments LeaveTypes: TO:DO
            const nmodified = {
              holiday_ID: holi._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Changed',
              changedObj: changeFields,
              oldHolidayData: holi
            }
            Audit.find({}).then(val =>{
              if(val.length) {
                Audit.findOneAndUpdate(
                  { },
                  { $push: { holidayAudit: nmodified  }  }, { new: true }).then();
              } else {
                Audit.create({ holidayAudit: nmodified  }).then();
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

module.exports = updateHoliday;
