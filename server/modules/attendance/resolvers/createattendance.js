const Attendance = require('../../../models/attendance');
const User = require('../../../models/user');
const Audit = require('../../../models/Audit');

const setAuditFun = function setAuditFun(attendance) {
  const modifiedObj = {
    newAttend_ID: attendance._id,
    action: 'Attendance Punched In/Out',
    created_by: attendance.created_by,
    created_at: attendance.created_at,
    createdAttendance: attendance
  };

  Audit.find({}).then(val => {
    if (val.length) {
      Audit.findOneAndUpdate(
        {},
        { $push: { attendanceAudit: modifiedObj } }, { new: true })
        .then();
    } else {
      Audit.create({ attendanceAudit: modifiedObj }, { new: true }).then();
    }
  });
};

const createAttendance = (_, {
  attendanceDate
}, { me, secret }) => new Promise(async (resolve, reject) => {

  try {

    const currentAttendance = await Attendance.find(
      {
        $and: [
          { 'attendanceDate.date': new Date(attendanceDate[0].date) }
          // { "attendanceDate.userID": attendanceDate[0].userID },
          // { "attendanceDate.punchIn": new Date(attendanceDate[0].punchIn) },
          // { punchOut: attendanceDate.punchOut }
        ]
      }
    );

    if (currentAttendance.length) {
      currentAttendance[0].attendanceDate.push({
        date: attendanceDate[0].date,
        userID: attendanceDate[0].userID,
        punchIn: attendanceDate[0].punchIn,
        punchOut: attendanceDate[0].punchOut,
        created_at: attendanceDate[0].created_at,
        created_by: attendanceDate[0].created_by
      });
      currentAttendance[0].save();
      setAuditFun(attendanceDate[0]);
      resolve(currentAttendance[0]);
    } else {

      const newAttend = await Attendance.create(
        {
          attendanceDate: {
            date: attendanceDate[0].date,
            userID: attendanceDate[0].userID,
            punchIn: attendanceDate[0].punchIn,
            punchOut: attendanceDate[0].punchOut,
            created_at: attendanceDate[0].created_at,
            created_by: attendanceDate[0].created_by
          }
        }
      );
      setAuditFun(attendanceDate[0]);
      resolve(newAttend);
    }
  } catch (error) {
    // your catch block code goes here
    reject(error);
  }

});

module.exports = createAttendance;
