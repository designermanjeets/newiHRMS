const Audit = require('../../../models/Audit');
const SalaryHead = require('../../../models/SalaryHead');

let updatedSalaryHead = null;

const updateSalaryHead = (_, {
  id,
  headName,
  headPercentage,
  headEmployeeShare,
  headOrgShare,
  headSalaryFrom,
  headSalaryTo,
  headActive,
  modified
}, {me,secret}) => new Promise(async (resolve, reject) => {
  try{
    let param ={
      headName,
      headPercentage,
      headEmployeeShare,
      headOrgShare,
      headSalaryFrom,
      headSalaryTo,
      headActive,
    }
    const currSalaryHead = await SalaryHead.findById(id);

    if (!currSalaryHead) reject(new Error('Salary Head not found!!'))

    if(currSalaryHead) {
      if (headName !== currSalaryHead.headName) {
        updatedSalaryHead = await SalaryHead.findByIdAndUpdate(id,
          {$set:{ headName: param.headName}},
          {new: true});
        resolve(updatedSalaryHead)
      } else {
        updatedSalaryHead = await SalaryHead.findByIdAndUpdate(id,
          {$set:{ ...param}},
          {new: true});
        resolve(updatedSalaryHead)
      }

      // Audit

      let changeFields = {};
      for ( let item in param) {
        if(param[item] && param[item] !== currSalaryHead[item]) {
          changeFields[item] = param[item];
        }
      }

      const modifiedObj = {
        newSalaryHeadID: updatedSalaryHead._id,
        action: 'Salary Head Modified',
        modified_by: modified[0].modified_by,
        modified_at: modified[0].modified_at,
        changedObj: changeFields,
        oldSalaryHead: currSalaryHead
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


    }
  } catch(error){
    reject(error);
  }
});

module.exports = updateSalaryHead;
