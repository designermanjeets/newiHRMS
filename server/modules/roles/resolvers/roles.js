const Role = require('../../../models/role');
const { paramHandler } = require('../../../utils/paramhandler');

const getRoles = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  Role.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getRoles;
