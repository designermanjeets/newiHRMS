const Attendance = require('../../../models/attendance');
const Audit = require('../../../models/Audit');
const User = require('../../../models/user');

const updateAttendance = (_, {
  id,
  user_ID,
  user_email,
  date,
  punchIn,
  punchOut,
  modified
}, {me,secret}) => new Promise(async (resolve, reject) => {
  try{
    let param ={
      user_ID,
      user_email,
      date,
      punchIn,
      punchOut,
    }
    const atten = await Attendance.findById(id);
    let changeFields = {};
    for ( item in param) {
      if(param[item] && param[item] !== atten[item]) {
        changeFields[item] = param[item];
        if(item === 'date') {
          if(JSON.stringify(param[item]) !== JSON.stringify(atten[item])) {
            changeFields[item] = param[item];
          } else {
            delete changeFields['date']
          }
        }
      }
    }
    if (!atten) throw new Error('Attendance not found!!')

    if(atten) {

      await Attendance.findByIdAndUpdate(id,{$set:{...param}},{new: true})
        .then((result) => {

          if(result) {

            // Update User Attendance
            User.findById({ _id: user_ID})
              .then((user) => {
                if(!user) { reject (new Error('No User Found!')) }
                else {
                  if (user.attendance && user.attendance.length) {
                    const lv = user.attendance.filter(lv => lv._id.toHexString() === id)[0];
                    lv.punchIn = param.punchIn;
                    lv.punchOut = param.punchOut;
                    lv.date = param.date;
                    user.save();
                  }
                }
            })

            const modifiedObj = {
              attendance_ID: atten._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Changed',
              changedObj: changeFields,
              oldAttendance: atten
            }

            Audit.find({}).then(val => {
              if(val.length) {
                Audit.findOneAndUpdate(
                  { },
                  { $push: { attendanceAudit: modifiedObj  }  }, { new: true }).then(
                  res => resolve(res)
                );
              } else {
                Audit.create({ attendanceAudit: modifiedObj  }, { new: true }).then(
                  res => resolve(res)
                );
              }
              resolve(result);
            });
            resolve(result);
          }
        })
    }
  } catch(error){
    reject(error);
  }
});

module.exports = updateAttendance;
