const Company = require('../../../models/company');

const createCompany = (_, {
                          companyname,
                          printname,
                          corporateID,
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
                          createdby,
                          createdon,
                          createdip,
                          modifiedby,
                          modifiedon,
                          modifiedip,
                          alias
                        },{me,secret}) => new Promise(async (resolve, reject) => {
  const company = await Company.findOne({$or:[ { corporateID},{companyname} ]})
  if (company) {
    reject('company already exist');
  } else {
    const newCompany = await Company.create({
      companyname,
      printname,
      corporateID,
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
      createdby,
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
