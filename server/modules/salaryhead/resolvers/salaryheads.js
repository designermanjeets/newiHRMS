const { paramHandler } = require('../../../utils/paramhandler');
const SalaryHead = require('../../../models/SalaryHead');

const getSalaryHeads = async (_, args, { me }) => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query);
  SalaryHead.find(param, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit);
});

module.exports = getSalaryHeads;
