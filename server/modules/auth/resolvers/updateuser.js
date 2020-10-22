const User = require('../../../models/user');
const Audit = require('../../../models/Audit');
const Designation = require('../../../models/designation');
const Role = require('../../../models/role');
const Shift = require('../../../models/shift');
const bcrypt = require('bcrypt')
const paramHandler = require('../../../utils/paramhandler');

const updateUser = (_, {
  id,
  username,
  email,
  password,
  role,
  firstname,
  lastname,
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
  modified
},{me,secret}) => new Promise(async (resolve, reject) => {
  try{
    const getuser = await User.findOne({$or:[ { email},{username}, {emmpid} ]})
    let param ={
      username,
      email,
      password,
      role,
      firstname,
      lastname,
      emmpid,
      corporateid,
      mobile,
      joiningdate,
      department,
      department_ID,
      permissions,
      shift
    }

    let changeFields = {};
    for ( item in param) {
      if(param[item] && param[item] !== getuser[item]) {
        if(item === 'permissions') {
          for(subitem in param[item]) {
            if(JSON.stringify(param[item][subitem]) !== JSON.stringify(getuser[item][subitem])) {
              changeFields['permissions'] = [];
              changeFields['permissions'].push(param[item]);
            }
          }
        } else {
          // Hash Password Here
          changeFields[item] = param[item];
          if(item === 'joiningdate' && JSON.stringify(param[item]) !== JSON.stringify(getuser[item])) {
            changeFields[item] = param[item];
          } else {
            delete changeFields['joiningdate']
          }
        }
      }
    }

    if(getuser && password && getuser.username !== 'superadmin') {
      if(password !== getuser.password) {
        param.password = await bcrypt.hash(password, 10)
      }
    }
    User.findByIdAndUpdate(
      {_id: id},
      { $set: {...param }, $push: { 'modified': modified  }  }, { new: true })
      .then((result) => {

        if(result) {

          // Designation Update
          Designation.findById({_id: designation_ID}).then(async val => {
            result.designation = {}; // Because only one Designation
            result.designation = val;
            await result.save();
            resolve(result);

          }).then(_ => {

            // Role Update
            Role.findById({_id: role}).then(async val => {
              if(val) {
                result.Role = {};
                result.Role = val;
                await result.save();
                resolve(result);
              }

            }).then(_ => {

              // Shift Update || Multiple
              // result.shift = []; // Because we're getting all in once
              // shift.forEach( (shft, i) => {
              //
              //   // Shift.findById({_id: shft._id}).then(async val => {
              //   //   const found = (result.shift.filter(val => val._id.toHexString() === shft))[0];
              //   //
              //   //   if(found) return false;
              //   //
              //   //   if(!found) {
              //   //     if (!result.shift && !result.shift.length) {
              //   //       result.shift = [];
              //   //     }
              //   //     result.shift.push(val);
              //   //     await setTimeout(_ => {
              //   //       result.save();
              //   //       resolve(result);
              //   //     }, i)
              //   //   }
              //   // }).then( _ => {
              //   //   // Something
              //   // });
              // })

              if(result && Object.keys(changeFields).length !== 0) {
                // Audit Below
                const modifiedObj = {
                  user_ID: getuser._id,
                  modified_by: modified[0].modified_by,
                  modified_at: modified[0].modified_at,
                  action: 'Changed',
                  changedObj: changeFields,
                  oldUserData: getuser
                }

                Audit.find({}).then(val => {
                  if(val.length) {
                    Audit.findOneAndUpdate(
                      { },
                      { $push: { userAudit: modifiedObj  }  }, { new: true })
                      .then();
                  } else {
                    Audit.create({ userAudit: modifiedObj  })
                      .then();
                  }
                  resolve(result);
                });
              }

            });
          });
        }
      }, error => {
        reject(error)
      })
  } catch(error){
    reject(error);
  }
});

module.exports = updateUser;
