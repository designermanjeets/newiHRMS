const User = require('../../../models/user')
const Audit = require('../../../models/Audit');
const Role = require('../../../models/role');
const Designation = require('../../../models/designation');
const Shift = require('../../../models/shift');
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
     shift,
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
        shift,
        permissions,
        created_at
      }
    ).then(result => {
      createToken({ id: result.id,role:result.role,username:result.username, emmpid},secret,'1d')
        .then(tokn => {

          // Designation Assign
          Designation.findById({_id: designation_ID}).then(async val => {
            result.designation = {}; // Because only one Designation
            result.designation = val;
            await result.save();
            resolve(result);

          }).then(_ => {

            // Role Assign
            Role.findById({_id: role}).then(async val => {
              if(val) {
                result.Role = {};
                result.Role = val;
                await result.save();
                resolve(result);
              }

            }).then(_ => {

              // Shift Assign
              Shift.find().then(async val => {
                // const found = (result.shift.filter(val => val._id.toHexString() === shift_ID))[0];
                //
                // if(found) return false;
                //
                // if(!found) {
                //   if (!result.shift && !result.shift.length) {
                //     result.shift = [];
                //   }
                //   result.shift.push(val);
                //   await result.save();
                //   resolve(result);
                // }
              })
              .then( _ => {

                // Audit Update
                const modifiedObj = {
                  newuser_ID: result._id,
                  action: 'User Created!',
                  created_by: created_by,
                  created_at: created_at,
                  createdUser: result
                }

                Audit.find({}).then(val => {
                  if(val.length) {
                    Audit.findOneAndUpdate(
                      { },
                      { $push: { userAudit: modifiedObj  }  }, { new: true }).then();
                  } else {
                    Audit.create({ userAudit: modifiedObj  }).then();
                  }
                });

              });
            });
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
