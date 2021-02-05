const Audit = require('../../../models/Audit');
const SalaryHead = require('../../../models/SalaryHead');

const deleteSalaryHead = (_, { id, modified }, { me, secret }) => new Promise(async (resolve, reject) => {
  try {
    const currSalaryHead = await SalaryHead.findById(id);

    if (!currSalaryHead) reject(new Error('Salary Head not found!!'));

    if (currSalaryHead) {

      await SalaryHead.findByIdAndDelete(id)

        .then((result) => {
          const modifiedObj = {
            currSalaryHeadID: currSalaryHead._id,
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            action: 'Salary Head Deleted!',
            deletedSalaryHead: currSalaryHead
          };

          Audit.find({}).then(val => {
            if (val.length) {
              Audit.findOneAndUpdate(
                {},
                { $push: { salaryHeadAudit: modifiedObj } }, { new: true }).then();
            } else {
              Audit.create({ salaryHeadAudit: modifiedObj }).then();
            }
          });
          resolve(result);
        });
    }
  } catch (error) {
    reject(error);
  }
});

module.exports = deleteSalaryHead;
