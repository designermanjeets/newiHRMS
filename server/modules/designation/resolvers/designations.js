const Designation = require('../../../models/designation');
const paramHandler = require('../../../utils/paramhandler');

const getDesignations = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  Designation.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getDesignations;
