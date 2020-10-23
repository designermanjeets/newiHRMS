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

  try {

    const exists = await Attendance.find({$and:[
        {user_ID }, {date}, {punchIn}, {punchOut}
      ]})

    if(exists.length) return reject(new Error('Attendance already exist for the same Date!'));

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

          newAttend.username = user.username;
          newAttend.firstname = user.firstname;
          newAttend.lastname = user.lastname;
          newAttend.save();

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
  }
  catch (error) {
    // your catch block code goes here
    reject(error)
  }

});

module.exports = createAttendance;
