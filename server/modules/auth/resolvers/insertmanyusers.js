const { UserInputError } = require('apollo-server-express')
const User = require('../../../models/user')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const SALT_ROUNDS = 12;

const insertManyUsers = (_, { input },{me,secret}) => new Promise(async (resolve, reject) => {

  let users = [];
  let count = 0;

  input.forEach((u) => {
    if(u.username !== 'superadmin') {
      const username = u.username; const emmpid = u.emmpid;
      User.findOne({$or:[ {username}, {emmpid} ]}).then(function(data){
        if (!data) {
          ++count;
          const pwd = u.password || '11';
          bcrypt.hash(pwd, 10).then(onfulfilles => {
            u.password = onfulfilles;
            User.create({...u}).then(res => {
              users.push(res);
              if(input.length === count) {
                resolve({users});
              }
              // createToken({ id: newUser.id,role:newUser.role,username:newUser.username, emmpid},secret,'1')
            })
          }, onrejected => {
            reject(new Error('Password generation failed!'));
          });
        } else {
          ++count;
          resolve(new Error(data.username + ' Username already exists!'));
        }
      })
    } else {
      resolve(new Error('User already Exists!'));
    }
  });
})

const createToken= async (user, secret, expiresIn) => {
  const { id, email, username, role, emmpid } = user;
  return await jsonwebtoken.sign({ id, email, username, role, emmpid }, secret, {
    expiresIn,
  });
};

module.exports = insertManyUsers
