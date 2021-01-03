const Attendance = require('../../../models/attendance');
const { paramHandler, findAttendance, findUser } = require('../../../utils/paramhandler');
const msEach = require('async-each');

const getAttendances = async (_, args, { me })  => new Promise(async (resolve, reject) => {

  const param = paramHandler(args.query)

  Attendance.find(param,(err, attendanceArr) => {

    if (err) reject(err);

    else {

      const newFilteredArr = [];

      msEach(attendanceArr,function (attendanceDate, callback, error) {

        if (error) console.error(error);

        msEach(attendanceDate.attendanceDate,function (attendance, callback, error) {

          if (error) console.error(error);

          findUser(attendance.userID, (err, userObj) => {
            if (err) console.log(err);
            attendance = {
              username: userObj.username,
              firstname: userObj.firstname,
              lastname: userObj.lastname,
              email: userObj.email,
              ...attendance._doc
            };
            newFilteredArr.push(attendance);
            callback();
          });
        }, function(err, done) {
          callback();
        });
      }, function(err, done) {
        resolve(newFilteredArr)
      });
    }
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = { getAttendances };
