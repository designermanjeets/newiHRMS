const User = require('../../../models/user');
const Audit = require('../../../models/Audit');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const SALT_ROUNDS = 12;

const signup = (_, {
  username,
  email,
  password,
  firstname,
  lastname,
  roleID,
  shiftIDs,
  employeeID,
  corporateID,
  designationID,
  mobile,
  joiningDate,
  permissions,
  created_by,
  created_at
}, { me, secret }) => new Promise(async (resolve, reject) => {
  const user = await User.findOne({ $or: [{ email }, { username }, { employeeID }] });
  if (user) {
    reject(new Error('user already exist'));
  } else {
    User.create({
        username,
        email,
        password: await bcrypt.hash(password, 10),
        firstname,
        lastname,
        mobile,
        joiningDate,
        permissions,
        created_by,
        created_at,
        roleID,
        shiftIDs,
        employeeID,
        corporateID,
        designationID,
      }
    ).then(user => {
      if (user) {
        createToken({ id: user.id, role: user.role, username: user.username, employeeID }, secret, '1d')
          .then(token => {
            if (token) {

              // const ifHasShift = user.shiftIDs.map(item => item._id).indexOf(shiftIDs);
              // console.log(ifHasShift);
              // item.save();

              // Audit Update
              const modifiedObj = {
                newUserID: user._id,
                action: 'User Created!',
                created_by: created_by,
                created_at: created_at,
                createdUser: user
              };

              Audit.find({}).then(val => {
                if (val.length) {
                  Audit.findOneAndUpdate(
                    {},
                    { $push: { userAudit: modifiedObj } }, { new: true }).then();
                } else {
                  Audit.create({ userAudit: modifiedObj }).then();
                }
              });

              resolve(user);
            }
          });
      }
    });
  }
});

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role, employeeID } = user;
  return await jsonwebtoken.sign({ id, email, username, role, employeeID }, secret, {
    expiresIn
  });
};

module.exports = signup;
