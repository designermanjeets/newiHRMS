const Audit = require('../../../models/Audit');
const SalaryHead = require('../../../models/SalaryHead');

const createSalaryHead = (_, {
  headName,
  headPercentage,
  headEmployeeShare,
  headOrgShare,
  headSalaryFrom,
  headSalaryTo,
  headActive,
  created_by,
  created_at
}, { me, secret }) => new Promise(async (resolve, reject) => {
  const rol = await SalaryHead.findOne({ $or: [{ headName }] });
  if (rol) {
    reject('Salary Head already exist!');
  } else {

    const newSalaryHead = await SalaryHead.create({
      headName,
      headPercentage,
      headEmployeeShare,
      headOrgShare,
      headSalaryFrom,
      headSalaryTo,
      headActive,
      created_by,
      created_at
    });

    const modifiedObj = {
      newSalaryHeadID: newSalaryHead._id,
      action: 'Salary Head Created',
      created_by: created_by,
      created_at: created_at,
      createdRole: newSalaryHead
    };

    Audit.find({}).then(val => {
      if (val.length) {
        Audit.findOneAndUpdate(
          {},
          { $push: { salaryHeadAudit: modifiedObj } }, { new: true })
          .then();
      } else {
        Audit.create({ salaryHeadAudit: modifiedObj }).then();
      }
    });
    resolve(newSalaryHead);
  }
});

module.exports = createSalaryHead;
