const SystemParameter = require('../../../models/sysparameters');
const Audit = require('../../../models/Audit');

const createOrUpdateSysparameters = (_, {
                          sysparams
                        },{me,secret}) => new Promise(async (resolve, reject) => {
  await SystemParameter.findOne({}).then(result => {
    let modifiedObj = {};
    if (result) {
      const found = result.sysparams.filter(val => val.sysparaname && val.sysparaname === sysparams[0].sysparaname);
      if (found.length) {
        found[0].sysparavalue = sysparams[0].sysparavalue;
        result.save();

        modifiedObj = {
          updatedSystemParameter_ID: found[0]._id,
          action: 'System Parameter Updated',
          modified_by: found[0].modified_by,
          modified_at: found[0].modified_at,
          updatedSystemParameter: found[0]
        }

      } else {
        result.sysparams.push(sysparams[0]);
        result.save();

        modifiedObj = {
          newSystemParameter_ID: sysparams[0]._id,
          action: 'System Parameter Created',
          created_by: sysparams[0].created_by,
          created_at: sysparams[0].created_at,
          createdSystemParameter: sysparams[0]
        }
      }
    } else {
      SystemParameter.create({ sysparams }, { new: true }).then(val => {
        resolve(result);
        modifiedObj = {
          newSystemParameter_ID: val[0]._id,
          action: 'System Parameter Created',
          created_by: val[0].created_by,
          created_at: val[0].created_at,
          createdSystemParameter: val[0]
        }
      })
    }


    Audit.find({}).then(val => {
      if (val.length) {
        Audit.findOneAndUpdate(
          {},
          { $push: { sysParaAudit: modifiedObj } }, { new: true })
          .then((res) => resolve(res));
      } else {
        Audit.create({ sysParaAudit: modifiedObj }, { new: true }).then((res) => resolve(res));
      }
    });
    resolve(result);

  });
});

module.exports = createOrUpdateSysparameters;
