const User = require('../../../models/user')
const Audit = require('../../../models/Audit');
const Role = require('../../../models/role');
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
    User.create({
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
    ).then(result => {
      createToken({ id: result.id,role:result.role,username:result.username, emmpid},secret,'1d')
        .then(tokn =>{

          Designation.findById({_id: designation_ID}).then( val =>{
            result.designation = {}; // Because only one Designation
            result.designation = val;
            result.save();
            resolve(result);
          });

          // Role Update
          Role.findById({_id: role}).then( val =>{
            let alldata = new User(result);
            result.Role = {};
            alldata.Role = val;
            alldata.save();
            resolve(result);
          });

          const nmodified = {
            newuser_ID: result._id,
            action: 'User Created!',
            created_by: created_by,
            created_at: created_at,
            createdUser: result
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

          resolve(result);

        });
      resolve(result);
    });
  }
})

const createToken= async (user, secret, expiresIn) => {
  const { id, email, username, role, emmpid } = user;
  return await jsonwebtoken.sign({ id, email, username, role, emmpid }, secret, {
    expiresIn,
  });
};

module.exports = signup
