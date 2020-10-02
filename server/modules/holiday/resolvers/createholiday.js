const Holiday = require('../../../models/holiday');
const Audit = require('../../../models/Audit');

const createHoliday = (_, {
                          id,
                          title,
                          date,
                          day,
                          paid,
                          created_by,
                          created_at
                        },{me,secret}) => new Promise(async (resolve, reject) => {
  const holiday = await Holiday.findOne({ "date": date })
  if (holiday) {
    reject('Holiday already exist!');
  } else {
    const newHoliday = await Holiday.create({
      id,
      title,
      date,
      day,
      paid,
      created_by,
      created_at
    });

    const nmodified = {
      newHoliday_ID: newHoliday._id,
      action: 'Holiday Created',
      created_by: created_by,
      created_at: created_at,
      createdHoliday: newHoliday
    }
    Audit.find({}).then(val =>{
      if(val.length) {
        Audit.findOneAndUpdate(
          { },
          { $push: { holidayAudit: nmodified  }  }, { new: true })
          .then((res) => resolve(res));
      } else {
        Audit.create({ holidayAudit: nmodified }, { new: true }).then((res) => resolve(res));
      }
      resolve(result);
    });
    resolve(newHoliday);
  }
});

module.exports = createHoliday;
