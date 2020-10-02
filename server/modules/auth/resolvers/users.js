const User = require('../../../models/user');
const paramHandler = require('../../../utils/paramhandler');


const user = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const user = await User.findOne({ "email": args.email });
  if(user || user.username !== 'superadmin') {
    return resolve(user);
  } else {
    return reject({data: 'User Not Found!'})
  }
});

const users = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query);
  User.find(param,(err, result) => {
    if(result) {
      const filteredAry = result.filter(e => e.username !== 'superadmin')
      if (err || !filteredAry.length) reject(new Error('No User Found!'));
      else resolve(filteredAry);
    } else {
      reject(new Error('No User Found!'));
    }
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = { user, users }
