const Role = require('../../../models/role');
const Audit = require('../../../models/Audit');

const deleteRole = (_, { id, modified }, {me,secret}) => new Promise(async (resolve, reject) => {
  try{
    const rol = await Role.findById(id);
    if (!rol) throw new Error('Role not found!!')
    if(rol) {
      await Role.findByIdAndDelete(id)
        .then((result) => {
          const modifiedObj = {
            role_ID: rol._id,
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            action: 'Role Deleted!',
            deletedRole: rol
          }
          Audit.find({}).then(val =>{
            if(val.length) {
              Audit.findOneAndUpdate(
                { },
                { $push: { roleAudit: modifiedObj  }  }, { new: true })
                .then((res) => resolve(res));
            } else {
              Audit.create({ roleAudit: modifiedObj  })
                .then((res) => resolve(res));
            }
          });
          resolve(result);
        })
    }
  } catch(error){
    reject(error);
  }
});

module.exports = deleteRole;
