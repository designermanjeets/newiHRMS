const SystemParameter = require('../../../models/sysparameters');
const Audit = require('../../../models/Audit');

const deleteSysparameter = (_, { id, sysparams },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    SystemParameter.find({}).then( result => {

      const sysparam = result[0].sysparams.findIndex(val => val._id.toHexString() === id);

      console.log(result[0].sysparams[sysparam])

      if (!result[0].sysparams[sysparam]) throw new Error('System Parameter not found!!')

      if(result[0].sysparams[sysparam]) {

        const modifiedObj = {
          sysparam_ID: result[0].sysparams[sysparam]._id,
          modified_by: sysparams[0].modified.modified_by,
          modified_at: sysparams[0].modified.modified_at,
          action: 'SystemParameter Deleted!',
          deletedSysparameter: sysparams
        }

        result[0].sysparams.splice(sysparam, 1);
        result[0].save();

        Audit.find({}).then(val => {
          if(val.length) {
            Audit.findOneAndUpdate(
              { },
              { $push: { sysParaAudit: modifiedObj  }  }, { new: true })
              .then();
          } else {
            Audit.create({ sysParaAudit: modifiedObj  })
              .then();
          }
        });
        resolve(result);
      }
    })
  } catch(error){
    reject(error);
  }
});

module.exports = deleteSysparameter;
