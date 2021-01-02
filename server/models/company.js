const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
  id: String,
  companyname: String,
  printname: String,
  corporateID: String,
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
  financialbegindate: Date,
  booksbegindate: Date,
  cinno: String,
  panno: String,
  gstin: String,
  currencyid: String,
  createdby: String,
  createdon: Date,
  createdip: String,
  modifiedby: String,
  modifiedon: Date,
  modifiedip: String,
  alias: String

}, {collection:'Company'});

module.exports = mongoose.model('Company', companySchema);
