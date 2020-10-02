const User = require('../../../models/user');
const Designation = require('../../../models/designation');
const Audit = require('../../../models/Audit');

const deleteDesignation = (_, { id, modified },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    const ltype = await Designation.findById(id);
    if (!ltype) throw new Error('Designation not found!!')
    if(ltype) {
      await Designation.findByIdAndDelete(id)
        .then((result) => {

          // DELETE USER DESIGNATION
          User.updateMany(
            {"designation._id": id},
            { $unset: { designation: result}  }, { new: true }).then();


          const nmodified = {
            design_ID: ltype._id,
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            action: 'Designation Deleted!',
            deletedDesignation: ltype
          }
          Audit.find({}).then(val =>{
            if(val.length) {
              Audit.findOneAndUpdate(
                { },
                { $push: { desigAudit: nmodified  }  }, { new: true })
                .then((result) => {
                  resolve(result);
                });
            } else {
              Audit.create({ desigAudit: nmodified  })
                .then((result) => {
                  resolve(result);
                });
            }
          });
          resolve(result);
        })
    }
  } catch(error){
    reject(error);
  }
});

module.exports = deleteDesignation
