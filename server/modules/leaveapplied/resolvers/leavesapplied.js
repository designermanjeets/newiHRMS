const User = require('../../../models/user');
const paramHandler = require('../../../utils/paramhandler');

const getLeavesApplied = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  User.find(param,(err, result) => {
    if (err) reject(err);
    else {
      const filtrArry = result.map(val => {
        return val.leaveApplied;
      });
      resolve(filtrArry[0]);
    }
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getLeavesApplied;
