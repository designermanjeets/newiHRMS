const User = require('../../../models/user');
const Audit = require('../../../models/Audit');
const Designation = require('../../../models/designation');
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
      permissions
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
    await User.findByIdAndUpdate(
      {_id: id},
      { $set: {...param }, $push: { 'modified': modified  }  }, { new: true })
      .then((result) => {
        resolve(result)
        if(result) {
          Designation.findById({_id: designation_ID}).then( val =>{
            result.designation = {}; // Because only one Designation
            result.designation = val;
            result.save();
            resolve(result);
          });
        }
        if(result && Object.keys(changeFields).length !== 0) {
          // Audit Below
          const nmodified = {
            user_ID: getuser._id,
            modified_by: modified[0].modified_by,
            modified_at: modified[0].modified_at,
            action: 'Changed',
            changedObj: changeFields,
            oldUserData: getuser
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
            resolve(result);
          });
        } else {
          resolve(result);
        }
      })
  } catch(error){
    reject(error);
  }
});

module.exports = updateUser;
