const Designation = require('../../../models/designation');
const { findDepartment } = require('../../../utils/paramhandler');
const msEach = require('async-each');
const { paramHandler } = require('../../../utils/paramhandler');

const getDesignations = async (_, args, { me })  => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query)
  Designation.find(param, async (err, designation) => {
    if (err) reject(err);
    const newDesignation = [];
    msEach(designation,function (item, callback, error) {
      if (error) console.error(error);
      findDepartment(item.departmentID, (err, departmentObj) => {
        if(err) console.log(err);
        item = { department: departmentObj.department, departmentID: departmentObj._id,  ...item._doc };
        newDesignation.push(item);
        callback();
      });
    }, function(err, done) {
      resolve(newDesignation)
    });
  }).skip(args.query.offset).limit(args.query.limit)
});

module.exports = getDesignations;
