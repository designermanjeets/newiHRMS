const User = require('../../../models/user');
const Designation = require('../../../models/designation');
const Audit = require('../../../models/Audit');
const LeaveType = require('../../../models/leaveType');

const updateDesignation = (_, {
  id,
  designation,
  department,
  modified,
  departmentID,
  leaveType
}, { me, secret }) => new Promise(async (resolve, reject) => {
  const dtype = await Designation.findById(id);
  try {
    let param = { designation, department, departmentID, leaveType };
    let changeFields = {};
    for (item in param) {
      if (param[item] && param[item] !== dtype[item]) {
        changeFields[item] = param[item];
      }
    }
    const ltype = await Designation.findOne({ $or: [{ _id: id }, { designation }] });

    if (!ltype) throw new Error('Designation not found!!');

    if (ltype) {

      await Designation.findByIdAndUpdate(id,
        {
          $set: { ...param },
          $push: { 'modified': modified }
        },
        { new: true }
      )
        .then((result) => {

          if (result && Object.keys(changeFields).length !== 0) {
            const modifiedObj = {
              design_ID: dtype._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Changed',
              changedObj: changeFields,
              oldDesignData: dtype
            };
            Audit.find({}).then(val => {
              if (val.length) {
                Audit.findOneAndUpdate(
                  {},
                  { $push: { desigAudit: modifiedObj } }, { new: true })
                  .then();
              } else {
                Audit.create({ desigAudit: modifiedObj })
                  .then();
              }
              resolve(result);
            });
          }
        });
    }
  } catch (error) {
    reject(error);
  }
});

module.exports = updateDesignation;
