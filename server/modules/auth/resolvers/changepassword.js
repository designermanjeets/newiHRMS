const User = require('../../../models/user');
const bcrypt = require('bcrypt')

const changePassword = (_, { id, username, email, oldPassword, newPassword},{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    const getuser = await User.findOne({email });
    let param = { username, email, oldPassword, newPassword }
    if(getuser && getuser.username !== 'superadmin') {
      const validOld = await bcrypt.compare(oldPassword, getuser.password);
      const validNew = newPassword !== oldPassword;
      if(validOld) {
        if(validNew) {
          param.password= await bcrypt.hash(newPassword, 10);
          const user = await User.findByIdAndUpdate(id,{ password: param.password },{new: true});
          resolve({user});
        } else {
          reject(new Error('New Password should not be same as Old Password!'))
        }
      } else {
        reject(new Error('Incorrect Old Password!'))
      }
    } else {
      reject(new Error('No User Found!'))
    }
  } catch(error){
    reject(error);
  }
});

module.exports = changePassword;
