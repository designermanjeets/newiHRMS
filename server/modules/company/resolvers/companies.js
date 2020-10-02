const Company = require('../../../models/company');
const paramHandler = require('../../../utils/paramhandler');


// Company
const getCompany = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const comp = await Company.findOne({ "corporateid": args.corporateid });
  if(comp) {
    return resolve(comp);
  } else {
    return reject({data: 'Company Not Found!'})
  }
});

 const getCompanies = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  Company.find(param,(err, result) => {
    if (err) reject(err);
    else resolve(result);
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = { getCompany, getCompanies }
