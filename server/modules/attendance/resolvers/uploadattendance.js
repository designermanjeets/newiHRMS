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
          const newArr= printAttendanceArray(rowsArr);
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

const printAttendanceArray = function(parentArray) {
  let newAttendanceArray = [];
  // console.log(parentArray);

  parentArray.forEach( function(childArray, parentIndex) {
    let newChildArray = [];
    childArray.forEach(function(item, childIndex){
      console.log(item);
      newChildArray.push(item)
    });
    console.log(newChildArray);
    // newAttendanceArray.push( { [parentArray[0][childIndex]]: childIndex[childIndex]  })
  });
  // console.log(newAttendanceArray);

};

module.exports = uploadAttendanceFile;
