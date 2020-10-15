const Attendance = require('../../../models/attendance')
const User = require('../../../models/user')
const Audit = require('../../../models/Audit')

const insertManyAttendances = (_, { input },{me,secret}) => new Promise(async (resolve, reject) => {

  let attendances = [];
  let count = 0;

  try {

    input.forEach((attend) => {
      try {
        Attendance.find({
          $and: [
            { user_ID: attend.user_ID },
            { date: attend.date },
            { punchIn: attend.punchIn },
            { punchOut: attend.punchOut }
          ]
        }).then(att => {
          if(!att.length) {
            User.find({ emmpid: attend.user_ID })
              .then((user) => {
                if (!user.length) {
                  console.log('return no user')
                  reject( new Error('No User found for given attendance!'))
                } else {
                  Attendance.create({ ...attend }).then((newAttend, error) => {
                    if(newAttend) {
                      if (!user[0].attendance) {
                        user[0]['attendance'] = [];
                        user[0].attendance.push(newAttend);
                        user[0].save();
                      } else {
                        user[0].attendance.push(newAttend);
                        user[0].save();
                      }

                      const modifiedObj = {
                        newAttend_ID: newAttend._id,
                        action: 'Attendance Bulk Upload Done',
                        created_by: attend.created_by,
                        created_at: attend.created_at,
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

                    } else {
                      return reject(new Error('Attendance Creation Failed! Try Again!'))
                    }
                  })
                  resolve(user)
                }
                resolve(user)
              }, error => {
                return reject(new Error('No User found for given attendance!'))
              })
          } else {
            return reject(new Error('Attendance already exist for the Date! ' + att[0].date))
          }
        });
      }
      catch (error) {
        return reject(error)
      }
    });
  }
  catch (error) {
    reject(error)
  }
})

module.exports = insertManyAttendances
