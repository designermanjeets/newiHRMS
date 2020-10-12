const SystemParameter = require('../../../models/sysparameters');
const paramHandler = require('../../../utils/paramhandler');

const getSysparameters = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  SystemParameter.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getSysparameters;
