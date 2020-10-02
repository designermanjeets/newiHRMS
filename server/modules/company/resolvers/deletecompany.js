const Company = require('../../../models/company');

const deleteCompany = (_, { corporateid },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    let param = { corporateid }
    const comp = await Company.findOne({ "corporateid": corporateid });
    if (!comp) throw new Error('Company not found!!')
    if(comp) {
      await Company.deleteOne({ "corporateid": corporateid }, {new: true})
        .then((result) => {
          resolve(result);
        })
    }
  } catch(error){
    reject(error);
  }
});


module.exports = deleteCompany;
