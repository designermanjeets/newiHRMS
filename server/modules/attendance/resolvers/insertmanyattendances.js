const Attendance = require('../../../models/attendance')
const User = require('../../../models/user')
const Audit = require('../../../models/Audit')

const insertManyAttendances = (_, { input },{me,secret}) => new Promise(async (resolve, reject) => {

  let attendances = [];
  let count = 0;

  try {

    input.forEach((attend) => {
      // console.log(attend);

      try {

        attend.empAttend.forEach((eachAttend, index) => {

          let empID = null;

          if (Object.keys(eachAttend)[0] === 'Code & Name') {
            empID = eachAttend[Object.keys(eachAttend)[0]][1];
          }

          console.log(eachAttend);
            const ObjectIN = eachAttend['IN'];
            const ObjectOUT = eachAttend['OUT'];
            const ObjectDate = eachAttend['DATE'];

            for (let key in ObjectDate) {
              if (ObjectDate.hasOwnProperty(key)) {
                console.log(key + " -> " + ObjectDate[key]);

                Attendance.find({
                  $and: [
                    { user_ID: empID },
                    { date: new Date(ObjectIN[key]).getDate() },
                    // { punchIn: attend.punchIn },
                    // { punchOut: attend.punchOut }
                  ]
                }).then( attfound => {
                  if(attfound.length) {
                    console.log('Match and Insert!');
                  } else {
                    console.log('Do not Match, just Insert!');
                    console.log(eachAttend['IN']);
                    // console.log(eachAttend['OUT']);
                    Attendance.create({
                      date: new Date(ObjectIN[key]).getDate(),
                      punchIn: ObjectIN ? ObjectIN[key] : null,
                      punchOut: ObjectOUT ? ObjectOUT[key] : null,
                      user_ID: empID,
                      // username: user[0].username,
                      // user_email: user[0].email,
                      // firstname: user[0].firstname,
                      // lastname: user[0].lastname
                    }).then((newAttend, error) => {
                      if(newAttend) {
                        console.log('newAttend');
                        console.log(newAttend);
                      }
                    });
                  }
                })
              }
            }


        })

      }
      catch (err) {

        return reject(err)

      }






      // try {
      //   Attendance.find({
      //     $and: [
      //       { user_ID: attend.user_ID },
      //       { date: attend.date },
      //       { punchIn: attend.punchIn },
      //       { punchOut: attend.punchOut }
      //     ]
      //   }).then(att => {
      //     if(!att.length) {
      //       User.find({ emmpid: attend.user_ID })
      //         .then((user) => {
      //           if (!user.length) {
      //             console.log('return no user')
      //             reject( new Error('No User found for given attendance!'))
      //           } else {
      //             Attendance.create({
      //               ...attend,
      //               user_ID: user[0]._id,
      //               username: user[0].username,
      //               user_email: user[0].email,
      //               firstname: user[0].firstname,
      //               lastname: user[0].lastname
      //             }).then((newAttend, error) => {
      //               if(newAttend) {
      //
      //                 if (!user[0].attendance) {
      //                   user[0]['attendance'] = [];
      //                   user[0].attendance.push(newAttend);
      //                   user[0].save();
      //                 } else {
      //                   user[0].attendance.push(newAttend);
      //                   user[0].save();
      //                 }
      //
      //                 const modifiedObj = {
      //                   newAttend_ID: newAttend._id,
      //                   action: 'Attendance Bulk Upload Done',
      //                   created_by: attend.created_by,
      //                   created_at: attend.created_at,
      //                   createdAttendance: newAttend
      //                 }
      //
      //                 Audit.find({}).then(val => {
      //                   if(val.length) {
      //                     Audit.findOneAndUpdate(
      //                       { },
      //                       { $push: { attendanceAudit: modifiedObj  }  }, { new: true })
      //                       .then();
      //                   } else {
      //                     Audit.create({ attendanceAudit: modifiedObj }, { new: true }).then();
      //                   }
      //                   resolve(newAttend);
      //                 });
      //
      //               } else {
      //                 return reject(new Error('Attendance Creation Failed! Try Again!'))
      //               }
      //             })
      //             resolve(user)
      //           }
      //           resolve(user)
      //         }, error => {
      //           return reject(new Error('No User found for given attendance!'))
      //         })
      //     } else {
      //       return reject(new Error('Attendance already exist for the Date! ' + att[0].date))
      //     }
      //   });
      // }
      // catch (error) {
      //   return reject(error)
      // }
    });
  }
  catch (error) {
    reject(error)
  }
})

module.exports = insertManyAttendances
