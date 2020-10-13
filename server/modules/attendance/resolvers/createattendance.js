const Attendance = require('../../../models/attendance');
const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const createAttendance = (_, {
  user_ID,
  user_email,
  date,
  punchIn,
  punchOut,
  created_at,
  created_by
  }, {me,secret}) => new Promise(async (resolve, reject) => {
  const newAttend= await Attendance.create({
    user_ID,
    user_email,
    date,
    punchIn,
    punchOut,
    created_at,
    created_by
  });

  User.findByIdAndUpdate({ _id: user_ID})
    .then((user) => {
      if(!user) { reject (new Error('No User Found!')) }
      else {
        if (!user.attendance) {
          user['attendance'] = [];
          user.attendance.push(newAttend);
        } else {
          user.attendance.push(newAttend);
        }
        user.save();
      }
    })

  const modifiedObj = {
    newAttend_ID: newAttend._id,
    action: 'Attendance Punched In/Out',
    created_by: created_by,
    created_at: created_at,
    createdAttendance: newAttend
  }
  Audit.find({}).then(val => {
    if(val.length) {
      Audit.findOneAndUpdate(
        { },
        { $push: { attendanceAudit: modifiedObj  }  }, { new: true })
        .then();
    } else {
      Audit.create({ attendanceAudit: modifiedObj }, { new: true }).then();
    }
    resolve(newAttend);
  });
  resolve(newAttend);
});

module.exports = createAttendance;
