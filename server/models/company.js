const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
  id: String,
  companyname: String,
  printname: String,
  corporateid: String,
  address1: String,
  address2: String,
  countryid: String,
  stateid: String,
  cityid: String,
  zipcode: String,
  phone: String,
  mobile: String,
  fax: String,
  email: String,
  website: String,
  financialbegindate: String,
  booksbegindate: String,
  cinno: String,
  panno: String,
  gstin: String,
  currencyid: String,
  Createdby: String,
  createdon: String,
  createdip: String,
  modifiedby: String,
  modifiedon: String,
  modifiedip: String,
  alias: String

}, {collection:'Company'});

module.exports = mongoose.model('Company', companySchema);
