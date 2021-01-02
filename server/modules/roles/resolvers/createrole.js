const Role = require('../../../models/role');
const Audit = require('../../../models/Audit');

const createRole = (_, {
  role_name,
  mod_employee,
  mod_holidays,
  mod_leaves,
  mod_events,
  mod_jobs,
  mod_assets,
  created_by,
  created_at,
  permissions
  },{me,secret}) => new Promise(async (resolve, reject) => {
  const rol = await Role.findOne({ $or: [{ role_name }] })
  if (rol) {
    reject('Role already exist!');
  } else {
    const newRole= await Role.create({
      role_name,
      mod_employee,
      mod_holidays,
      mod_leaves,
      mod_events,
      mod_jobs,
      mod_assets,
      created_by,
      created_at,
      permissions
    });

    const modifiedObj = {
      newRole_ID: newRole._id,
      action: 'Role Created',
      created_by: created_by,
      created_at: created_at,
      createdRole: newRole
    }

    Audit.find({}).then(val => {
      if(val.length) {
        Audit.findOneAndUpdate(
          { },
          { $push: { roleAudit: modifiedObj  }  }, { new: true })
          .then();
      } else {
        Audit.create({ roleAudit: modifiedObj }).then();
      }
    });
    resolve(newRole);
  }
});

module.exports = createRole;
