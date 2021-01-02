const LeaveApplied = require('../../../models/leaveapplied');
const { paramHandler, findUser, findLeaveType } = require('../../../utils/paramhandler');
const msEach = require('async-each');

const getLeavesApplied = async (_, args, { me }) => new Promise(async (resolve, reject) => {
  const param = paramHandler(args.query);
  LeaveApplied.find(param, (err, leaveAppliedAll) => {
    if (err) reject(err);
    else {

      const newFilteredArr = [];

      msEach(leaveAppliedAll, function(leaveApplied, callback, error) {
        if (error) console.error(error);
        findUser(leaveApplied.userID, (err, userObj) => {
          if (err) console.log(err);
          leaveApplied = {
            username: userObj.username,
            firstname: userObj.firstname,
            ...leaveApplied._doc
          };
          findLeaveType(leaveApplied.leaveTypeID, (err, leaveTypeObj) => {
            if (err) console.log(err);
            leaveApplied = {
              leaveType: leaveTypeObj.leaveType,
              ...leaveApplied
            };
            newFilteredArr.push(leaveApplied);
            callback();
          });
        });
      }, function(err, done) {
        resolve(newFilteredArr);
      });

    }
  }).skip(args.query.offset).limit(args.query.limit);
});

module.exports = getLeavesApplied;
