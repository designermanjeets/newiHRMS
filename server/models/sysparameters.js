const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
});

const sysSubSchema = mongoose.Schema({
  id: String,
  sysparaname: String,
  sysparavalue: String,
  created_at: Date,
  created_by: String,
  modified : [subSchema],
}, { strict : false });

const sysParametersSchema = new Schema({
  id: String,
  sysparams: [sysSubSchema],
}, {collection:'SysParameters'});

module.exports = mongoose.model('SysParameters', sysParametersSchema);
