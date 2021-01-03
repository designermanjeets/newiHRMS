const Designation = require('./../models/designation');
const Department = require('./../models/department');
const Role = require('./../models/role');
const User = require('./../models/user');
const LeaveType = require('./../models/leavetype');
const Attendance = require('./../models/attendance');
const mongoose = require('mongoose'); // ES5 or below
var ObjectId = mongoose.Types.ObjectId;

const paramHandler= (qry)  => {
  let param = {};
  if(qry.argument && qry.query)param= {[qry.argument]: {'$regex':qry.query}}
  if(qry.dates){
    const gte = qry.dates.gte?new Date(qry.dates.gte):null
    let lt = qry.dates.lt?new Date(qry.dates.lt):null
    param.updatedAt = {}
    if(gte)param.meta.updatedAt.$gte=gte
    if(lt){
      param.meta.updatedAt.$lte=lt.setDate(lt.getDate()+1)
    }
  }
  if(qry.departmentID) { param.departmentID = qry.departmentID }
  if(qry.designationID) { param.designationID = qry.designationID }
  if(qry.id) { param._id = qry.id }
  return param
};

findDesignation = function findDesignation(ID, callback){
  const foundDesignation = Designation.findById(ID, (err, obj) => {
    if(err){
      callback(err)
    } else if (obj){
      callback(null,obj)
    } else {
      callback(reject(new Error('Some strange thing has happened')));
    }
  });
}

findDepartment = function findDepartment(ID, callback){
  const foundDepartment = Department.findById(ID, (err, obj) => {
    if(err){
      callback(err)
    } else if (obj){
      callback(null,obj)
    } else {
      callback(reject(new Error('Some strange thing has happened')));
    }
  });
}

findRole = function findRole(ID, callback){
  const foundRole = Role.findById(ID, (err, obj) => {
    if(err){
      callback(err)
    } else if (obj){
      callback(null,obj)
    } else {
      callback(new Error('Some strange thing has happened'));
    }
  });
}

findUser = function findUser(ID, callback){
  const foundUser = User.findById(ID, (err, obj) => {
    if(err){
      callback(err)
    } else if (obj){
      callback(null,obj)
    } else {
      callback(new Error('Some strange thing has happened'));
    }
  });
}

findLeaveType = function findLeaveType(ID, callback){
  const foundLeaveType = LeaveType.findById(ID, (err, obj) => {
    if(err){
      callback(err)
    } else if (obj){
      callback(null,obj)
    } else {
      callback(new Error('Some strange thing has happened'));
    }
  });
}

findAttendance = function findAttendance(ID, callback){

  const foundAttendance = Attendance.find(
    {
      $and: [
        { 'attendanceDate._id': ID }
      ]
    }
  , (err, obj) => {
      if(err){
        callback(err)
      } else if (obj){
        callback(null,obj)
      } else {
        callback(new Error('Some strange thing has happened'));
      }
    });

  // const foundAttendance = Attendance.findById(ID , (err, obj) => {
  //   if(err){
  //     callback(err)
  //   } else if (obj){
  //     callback(null,obj)
  //   } else {
  //     callback(new Error('Some strange thing has happened'));
  //   }
  // });
}

module.exports = { paramHandler, findDesignation, findDepartment, findRole, findUser, findLeaveType, findAttendance };
