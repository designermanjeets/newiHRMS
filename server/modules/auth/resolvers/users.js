const User = require('../../../models/user');
const Department = require('../../../models/department');
const Designation = require('../../../models/designation');
const { paramHandler, findDesignation, findDepartment, findRole } = require('../../../utils/paramhandler');
const msEach = require('async-each');


const user = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const user = await User.findOne({ "email": args.email });
  if(user || user.username !== 'superadmin') {
    return resolve(user);
  } else {
    return reject({data: 'User Not Found!'})
  }
});

const users = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query);
  User.find(param, async(err, user) => {
    if(user) {

      const filteredAry = user.filter(e => e.username !== 'superadmin')

      if (err || !filteredAry.length) reject(new Error('No User Found!'));

      else {

        const newFilteredArr = [];

        msEach(filteredAry,function (item, callback, error) {
          if (error) console.error(error);
          findDesignation(item.designationID, (err, designationObj) => {
            if(err) console.log(err);
            item = { designation: designationObj.designation, ...item._doc };
            findDepartment(designationObj.departmentID, (err, departmentObj) => {
              if(err) console.log(err);
              item = { department: departmentObj.department, departmentID: departmentObj._id,  ...item };
              findRole(item.roleID, (err, roleObj) => {
                if(err) console.log(err);
                item = { role: roleObj.role_name, ...item };
                newFilteredArr.push(item);
                callback();
              });
            });
          });
        }, function(err, done) {
          resolve(newFilteredArr)
        });
      }
    } else {
      reject(new Error('No User Found!'));
    }
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = { user, users }
