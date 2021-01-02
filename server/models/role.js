const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
}); //,{ _id : false }

const roleSchema = new Schema({
  id: String,
  role_name: { type: String, required: true },
  mod_employee: { type: Boolean, default: false },
  mod_holidays: { type: Boolean, default: false },
  mod_leaves: { type: Boolean,  efault: false },
  mod_events: { type: Boolean, default: false },
  mod_jobs: { type: Boolean, default: false },
  mod_assets: { type: Boolean, default: false },
  permissions: {
    employees: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    holidays: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    leaves: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    events: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    jobs: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    assets: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      import: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    }
  },
  created_at: Date,
  created_by: String,
  modified: [subSchema]

}, { collection: 'Role' });

module.exports = mongoose.model('Role', roleSchema);
