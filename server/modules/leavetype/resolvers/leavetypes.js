const LeaveType = require('../../../models/leaveType');
const { paramHandler } = require('../../../utils/paramhandler');

const getLeaveTypes = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  LeaveType.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getLeaveTypes;
