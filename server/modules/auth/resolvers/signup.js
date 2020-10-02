const User = require('../../../models/user')
const Audit = require('../../../models/Audit');
const Designation = require('../../../models/designation');
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const SALT_ROUNDS = 12

const signup = (_, {
     username,
     email,
     password,
     firstname,
     lastname,
     role,
     emmpid,
     corporateid,
     mobile,
     joiningdate,
     department,
     department_ID,
     designation,
     designation_ID,
     permissions,
     created_by,
     created_at
   },{me, secret}) => new Promise(async (resolve, reject) => {
  const user = await User.findOne({$or:[ { email},{username}, {emmpid} ]})
  if (user) {
    reject(new Error('user already exist'));
  } else {
    const newUser = await User.create({
        username,
        email,
        password: await bcrypt.hash(password, 10),
        firstname,
        lastname,
        role,
        emmpid,
        corporateid,
        mobile,
        joiningdate,
        department,
        department_ID,
        designation_ID,
        permissions,
        created_at
      }
    )
    await createToken({ id: newUser.id,role:newUser.role,username:newUser.username, emmpid},secret,'1d')

    if(newUser) {
      Designation.findById({_id: designation_ID}).then( val =>{
        result.designation = {}; // Because only one Designation
        result.designation = val;
        result.save();
        resolve(result);
      });
    }

    const nmodified = {
      newuser_ID: newUser._id,
      action: 'User Created!',
      created_by: created_by,
      created_at: created_at,
      createdUser: newUser
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
    resolve(newUser);
    return newUser;
  }
})

const createToken= async (user, secret, expiresIn) => {
  const { id, email, username, role, emmpid } = user;
  return await jsonwebtoken.sign({ id, email, username, role, emmpid }, secret, {
    expiresIn,
  });
};

module.exports = signup
