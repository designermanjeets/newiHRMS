const shortid = require('shortid');
const Upload = require('../../../models/upload')
const fs = require('fs');
const path = require('path');
const os = require('os');
const tmpDir = os.tmpdir();
const excelReader = require('../../../utils/excel-reader');

let tmppath = '';

const uploadAttendanceFile =  async (_, { file },{me,secret}) => new Promise(async (resolve, reject) => {

  fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), (err, directory) => {
    if (err) throw err;
    tmppath = directory;
    // Prints: /tmp/foo-itXde2 or C:\Users\...\AppData\Local\Temp\foo-itXde2
    processUpload(file, tmppath).then(upload => {
      console.log(upload);
      if(!upload) reject(new Error('Upload failed!'));
      Upload.create(upload).then( up => {
        if(!up) reject(new Error('Upload failed!'));
        const employeesJsonArray = excelReader.readExcel(upload.path);
        resolve(employeesJsonArray);
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


module.exports = uploadAttendanceFile;
