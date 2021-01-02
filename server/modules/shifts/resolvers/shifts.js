const Shift = require('../../../models/shift');
const { paramHandler } = require('../../../utils/paramhandler');

const getShifts = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  Shift.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getShifts;
