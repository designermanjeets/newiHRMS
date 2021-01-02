const Department = require('../../../models/department');
const { paramHandler } = require('../../../utils/paramhandler');

const getDepartments = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  Department.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getDepartments;
