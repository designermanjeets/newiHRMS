const Company = require('../../../models/company');

const deleteCompany = (_, { corporateID },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    let param = { corporateID }
    const comp = await Company.findOne({ "corporateID": corporateID });
    if (!comp) throw new Error('Company not found!!')
    if(comp) {
      await Company.deleteOne({ "corporateID": corporateID }, {new: true})
        .then((result) => {
          resolve(result);
        })
    }
  } catch(error){
    reject(error);
  }
});


module.exports = deleteCompany;
