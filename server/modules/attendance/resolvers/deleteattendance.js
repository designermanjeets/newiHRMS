const Attendance = require('../../../models/attendance');
const Audit = require('../../../models/Audit');
const User = require('../../../models/user');

const deleteAttendance = (_, {
  id,
  user_ID,
  user_email,
  date,
  modified
}, {me,secret}) => new Promise(async (resolve, reject) => {
  try{

    const atten = await Attendance.findById(id);

    if (!atten) throw new Error('Attendance not found!!')

    if(atten) {

      await Attendance.findByIdAndDelete(id)
        .then((result) => {

          // Update User Attendance
          User.findById({ _id: user_ID})
            .then((user) => {
              if(!user) { reject (new Error('No User Found!')) }
              else {
                if (user.attendance && user.attendance.length) {
                  const lv = user.attendance.findIndex(lv => lv._id.toHexString() === id);
                  user.attendance.splice(lv, 1);
                  user.save();
                }
              }
          })

          const modifiedObj = {
            Attendance_ID: atten._id,
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            action: 'Attendance Deleted!',
            deletedAttendance: atten
          }

          Audit.find({}).then(val => {
            if(val.length) {
              Audit.findOneAndUpdate(
                { },
                { $push: { roleAudit: modifiedObj  }  }, { new: true })
                .then((res) => resolve(res));
            } else {
              Audit.create({ roleAudit: modifiedObj  }, { new: true })
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

module.exports = deleteAttendance;
