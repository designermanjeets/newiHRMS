const Attendance = require('../../../models/attendance');
const User = require('../../../models/user');
const { paramHandler } = require('../../../utils/paramhandler');

const getAttendances = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  Attendance.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit)
});

const getUserAttendances = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  User.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result[0].attendance);
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = { getAttendances, getUserAttendances };
