const shortid = require('shortid');
const Upload = require('../../../models/upload')
const fs = require('fs');
const path = require('path');
const os = require('os');
const tmpDir = os.tmpdir();
const excelReader = require('../../../utils/excel-reader');
const readXlsxFile = require('read-excel-file/node');

let tmppath = '';

const schema = {
  'Company': {
    prop: 'Company',
    type: String
  },
}

const uploadAttendanceFile =  async (_, { file },{me,secret}) => new Promise(async (resolve, reject) => {

  fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), (err, directory) => {
    if (err) throw err;
    tmppath = directory;
    // Prints: /tmp/foo-itXde2 or C:\Users\...\AppData\Local\Temp\foo-itXde2
    processUpload(file, tmppath).then(upload => {
      if(!upload) reject(new Error('Upload failed!'));
      Upload.create(upload).then( up => {
        if(!up) reject(new Error('Upload failed!'));

        // File path.
        readXlsxFile(upload.path).then((rowsArr ) => {
          // console.log(rowsArr)
          const newArr= printArray(rowsArr);
          resolve(newArr);
          // `rows` is an array of rows
          // each row being an array of cells.
        })


        // const employeesJsonArray = excelReader.readExcel(upload.path);
        // resolve(employeesJsonArray);
      });
    })
  });

});

const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  const path = `${tmppath}/${id}-${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(path))
      .on("finish", () => resolve({ id, path, filename, mimetype }))
      .on("error", reject)
  );
};

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  return await storeUpload({ stream, filename, mimetype });
};

const printArray = function(parentArray) {
  let newAttendanceArray = [];
  newAttendanceArray.push({EmployeesData: []}); // Insert an Empty Object of Arrays
  let METADATA = [];
  let EMPINDIVIDUAL = [];
  parentArray.forEach( function(childArray, index) {
    let emmps = [];

    childArray.forEach(function(item){

      if(item && (typeof item === 'string' || item instanceof String) &&
        ( item.includes('Company Name') ||
          item.includes('Run Date & Time') ||
          item.includes('Monthly Performance from') ||
          item.includes('Department Code & Name')
        )) {
        childArray = childArray.filter( el => el != null);
        METADATA.push(...childArray)
      }
      if(item && (typeof item === 'string' || item instanceof String) &&
        ( item === ('** Code & Name :-'))) {
        childArray = childArray.filter( el => el != null);
        emmps = [];
        emmps.push({ 'Code & Name' : { ...childArray } })
      }
      if(item && (typeof item === 'string' || item instanceof String) &&
        ( item === ('DATE') || item === ('Day') ||
          item === ('SHIFT') || item === ('IN') ||
          item === ('OUT') || item === ('LATE') ||
          item === ('EARLY DEPAT.') || item === ('W.HOUR') ||
          item === ('OT') || item === ('STATUS') || item === ('SHIFT ATTENDED')
        )) {
        childArray.splice(0, 2);
        emmps.push({ [item] : { ...childArray } })
      }
    });
    EMPINDIVIDUAL.push(...emmps);
  });

  newAttendanceArray[0]['EmployeesData'].push(...EMPINDIVIDUAL);
  newAttendanceArray.push({ METADATA: { ...METADATA } })

  return newAttendanceArray;

}

module.exports = uploadAttendanceFile;
