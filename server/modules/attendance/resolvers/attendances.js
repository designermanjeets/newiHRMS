const Attendace = require('../../../models/attendance');
const paramHandler = require('../../../utils/paramhandler');

const getAttendances = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  Attendace.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getAttendances;
