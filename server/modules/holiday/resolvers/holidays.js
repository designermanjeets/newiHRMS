const Holiday = require('../../../models/holiday');
const paramHandler = require('../../../utils/paramhandler');

const getHolidays = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  Holiday.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getHolidays;
