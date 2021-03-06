const Company = require('../../../models/company');

const createCompany = (_, {
                          companyname,
                          printname,
                          corporateid,
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
                          Createdby,
                          createdon,
                          createdip,
                          modifiedby,
                          modifiedon,
                          modifiedip,
                          alias
                        },{me,secret}) => new Promise(async (resolve, reject) => {
  const company = await Company.findOne({$or:[ { corporateid},{companyname} ]})
  if (company) {
    reject('company already exist');
  } else {
    const newCompany = await Company.create({
      companyname,
      printname,
      corporateid,
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
      Createdby,
      createdon,
      createdip,
      modifiedby,
      modifiedon,
      modifiedip,
      alias
    })
    resolve(newCompany);
  }
})

module.exports = createCompany
