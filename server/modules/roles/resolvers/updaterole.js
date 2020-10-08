const Role = require('../../../models/role');
const Audit = require('../../../models/Audit');

const updateRole = (_, {
  id,
  role_name,
  mod_employee,
  mod_holidays,
  mod_leaves,
  mod_events,
  mod_jobs,
  mod_assets,
  permissions,
  modified
}, {me,secret}) => new Promise(async (resolve, reject) => {
  try{
    let param ={
      mod_employee,
      mod_holidays,
      mod_leaves,
      mod_events,
      mod_jobs,
      mod_assets,
      permissions
    }
    const rol = await Role.findById(id);
    let changeFields = {};
    for ( item in param) {
      if(param[item] && param[item] !== rol[item]) {
        changeFields[item] = param[item];
        if(item === 'date') {
          if(JSON.stringify(param[item]) !== JSON.stringify(rol[item])) {
            changeFields[item] = param[item];
          } else {
            delete changeFields['date']
          }
        }
      }
    }
    if (!rol) throw new Error('Role not found!!')
    if(rol) {
      await Role.findByIdAndUpdate(id,{$set:{...param}},{new: true})
        .then((result) => {
          if(result && Object.keys(changeFields).length !== 0) {
            // To Update All Departments LeaveTypes: TO:DO
            const modifiedObj = {
              role_ID: rol._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Changed',
              changedObj: changeFields,
              oldRoleData: rol
            }
            Audit.find({}).then(val =>{
              if(val.length) {
                Audit.findOneAndUpdate(
                  { },
                  { $push: { roleAudit: modifiedObj  }  }, { new: true })
                  .then();
              } else {
                Audit.create({ roleAudit: modifiedObj  }, { new: true })
                  .then();
              }
              resolve(result);
            });
            resolve(result);
          }
        })
    }
  } catch(error){
    reject(error);
  }
});

module.exports = updateRole;
