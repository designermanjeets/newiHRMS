const Company = require('../../../models/company');

const updateCompany = (_, {
  companyname,
  printname,
  address1,
  address2,
  countryid,
  corporateID,
  stateid,
  cityid,
  zipcode,
  phone,
  mobile,
  fax,
  email,
  website,
  financialbegindate,
  booksbegindate,
  cinno,
  panno,
  gstin,
  currencyid,
  modifiedby,
  modifiedon,
  modifiedip,
  alias
},{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    let param ={
      companyname,
      printname,
      address1,
      address2,
      countryid,
      stateid,
      cityid,
      zipcode,
      phone,
      mobile,
      fax,
      email,
      website,
      financialbegindate,
      booksbegindate,
      cinno,
      panno,
      gstin,
      currencyid,
      modifiedby,
      modifiedon,
      modifiedip,
      alias
    }
    console.log(corporateID)
    const comp = await Company.findOne({ "corporateID": corporateID });
    if (!comp)throw new Error('Company not found!!')
    if(comp) {
      await Company.findOneAndUpdate({
        "corporateID": corporateID
      },{$set:{...param}},{new: true})
        .then((result) => { resolve(result) })
    }
  }catch(error){
    reject(error);
  }
});


module.exports = updateCompany;
