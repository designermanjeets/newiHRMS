const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subSchema = mongoose.Schema({
  modified_by: String,
  modified_at: Date
});

const attendanceSchema = new Schema({
  attendanceDate: [
    {
      userID: String,
      employeeID: String,
      date: Date,
      punchIn: String,
      punchOut: String,
      created_at: Date,
      created_by: String,
      modified : [subSchema],
    }
  ]
}, { collection:'Attendance' });

module.exports = mongoose.model('Attendance', attendanceSchema);
