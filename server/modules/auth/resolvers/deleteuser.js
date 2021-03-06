const User = require('../../../models/user')
const Audit = require('../../../models/Audit');

const deleteUser = (_, { email, modified },{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    let param = { email, modified }
    const user = await User.findOne({ "email": email });
    if (!user) reject( new Error('User not found!!'))
    if(user && user !== 'superadmin') {
      await User.deleteOne({ "email": email }, {new: true})
      const nmodified = {
        user_ID: user._id,
        modified_by: modified[0].modified_by,
        modified_at: modified[0].modified_at,
        action: 'User Deleted!',
        deletedUser: user
      }
      Audit.find({}).then(val =>{
        if(val.length) {
          Audit.findOneAndUpdate(
            { },
            { $push: { userAudit: nmodified  }  }, { new: true })
            .then((result) => {
              resolve(result);
            });
        } else {
          Audit.create({ userAudit: nmodified  })
            .then((result) => {
              resolve(result);
            });
        }
      });
      resolve({User});
    }
  } catch(error){
    reject(error);
  }
})

module.exports = deleteUser;
