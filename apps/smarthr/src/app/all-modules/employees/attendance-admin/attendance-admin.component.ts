import { ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { UploadOutput, UploadInput, UploadFile, UploaderOptions } from 'ngx-uploader';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Apollo } from 'apollo-angular';
import {
  GET_ATTENDANCES_ADMIN_QUERY,
  ImportAttendanceADMINGQL,
  UploadAttendanceFileADMINGQL
} from './attendance-admin-gql.service';
declare const $: any;

@Component({
  selector: 'app-attendance-admin',
  templateUrl: './attendance-admin.component.html',
  styleUrls: ['./attendance-admin.component.css']
})
export class AttendanceAdminComponent implements OnInit {

  rows: any[] = [];
  srch: any[] = [];
  allAttendances: [] = [];
  userAttArray: [] = [];

  selected = [];
  columns: any[] = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  options: UploaderOptions;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  fileToUpload: File = null;

  currDate = Date.now();
  thisMonthSheet: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private apollo: Apollo,
    private uploadAttendanceFileGQL: UploadAttendanceFileADMINGQL,
    private importAttendanceGQL: ImportAttendanceADMINGQL,
  ) {
    this.options = { concurrency: 1, maxUploads: 3, maxFileSize: 1000000 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
  }

  ngOnInit() {
    this.loadAttendances();
  }


  loadAttendances() {

    this.apollo.watchQuery({
      query: GET_ATTENDANCES_ADMIN_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges
      .pipe(map ((value: any) => value.data.getAttendances))
      .subscribe((response: any) => {
        if (response) {

          this.userAttArray = this.getAttendPerUser(response);

          const datatableArr = this.getCurrMonth(this.userAttArray);

          this.srch = [];
          this.srch = datatableArr;
          this.rows = [...this.srch];

          this.cdRef.detectChanges();
        }
      }, error => this.toastr.error(error, 'Error'));
  }

  getAttendPerUser(arr) {
    return _.chain(arr)
      .groupBy('user_ID')
      .map((usrattendance) => ({ usrattendance }))
      .value();
  }

  getCurrMonth(userAttArray) {

    const days = Array.from({
        length: moment(this.currDate).daysInMonth()
      },
      (x, i) => {
        moment(this.currDate).startOf('month').add(i, 'days').format('DD');
    });

    // @ts-ignore
    days.forEach((value, i) => days[i] = { index: i }); // Null Handling

    const allusers = [];
    let curruser = [];
    _.each(userAttArray, att => {
      _.each(att, (attusr) => {
        curruser = _.clone(days);
        _.each(curruser, crr => { // Kinda Reset
          crr.firstname = attusr[0].username;
          crr.lastname = attusr[0].lastname;
          crr.user_ID = attusr[0].user_ID;
          crr.user_email = attusr[0].user_email;
          crr.punchIn = null;
          crr.punchOut = null;
          crr.date = null;
          crr.__typename =  'Attendance';
          crr._id =  null;
        });

        _.each(attusr, (attdays) => {
          attdays.index = moment(attdays.date).format('D');
          curruser[attdays.index] = attdays;
        });
        allusers.push(curruser);
      });
    });

    console.log(this.userAttArray);
    console.log(allusers);

    return allusers;

  }

  // Upload

  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        // if you want to auto upload files when added
        // const event: UploadInput = {
        //   type: 'uploadAll',
        //   url: 'http://localhost:3000/graphql/',
        //   method: 'POST',
        //   data: this.files[0]
        // };
        // this.uploadInput.emit(event);
        this.startUpload();
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'done':
        // The file is downloaded
        break;
    }
  }

  // Manual Upload In case you need it
  startUpload() {
    this.uploadAttendanceFileGQL
      .mutate({
        file: this.files[0].nativeFile
      }).pipe(
      map((val: any) => val.data.uploadAttendanceFile)
    )
      .subscribe( (val: any) => {
        if (val) {
          console.log(val);
          const allEmpData = this.cleanData(val);
          this.onImportgetData(allEmpData);
          console.log(allEmpData);
        }
      }, error => {
        console.log(error);
      });
  }

  cleanData(val) {
    console.log(val[1].METADATA);

    let str = val[1].METADATA[2]; // Only Interested in Month Range
    str = str.split('from').pop().split('To')[0]; // returns Month
    str = moment(str, 'DD/MM/YYYY');
    console.log(str);

    const perUser = [];
    let isCombine = false;
    let count = 0;
    _.each(val[0].EmployeesData, vl => {
      // console.log(Object.keys(vl)[0]);
      if (Object.keys(vl)[0] && (Object.keys(vl)[0] === 'IN' || Object.keys(vl)[0] === 'OUT')) {

        for (let item in vl.IN) {
          if (vl.IN[item]) {
            vl.IN[item] = vl.IN[item].split('T').pop().split('.')[0];
            vl.IN[item] = moment(str).add(item, 'days').add(vl.IN[item], 'hours');
          }
        }
        for (let item in vl.OUT) {
          if (vl.OUT[item]) {
            vl.OUT[item] = vl.OUT[item].split('T').pop().split('.')[0];
            vl.OUT[item] = moment(str).add(item, 'days').add(vl.OUT[item], 'hours');
          }
        }

      }
      if (Object.keys(vl)[0] && Object.keys(vl)[0] === 'Code & Name') {
        isCombine = true;
        perUser.push({empAttend: []});
        count++;
      }
      if (isCombine) {
        perUser[count - 1].empAttend.push(vl);
      }
    });
    return perUser;
  }

  onImportgetData(rowData) {
    console.log(rowData);
    // rowData.forEach((r, i) => {
    //   if (r.date instanceof Date && !isNaN(r.date)) {
    //     // console.log('valid Date!');
    //   } else {
    //     // console.log('Invalid!'); // But Convert First
    //     r.date = moment(r.date, 'DD MM YYYY');
    //   }
    //   delete r.__typename;
    // });
    //
    // const uniqArrByUserID = _.difference(rowData, _.uniqBy(rowData, 'user_ID'), 'user_ID');
    // const uniqArrByDate = _.difference(rowData, _.uniqBy(rowData, 'date'), 'date');
    //
    // if (uniqArrByUserID.length) {
    //   console.log('Duplicate User ID');
    //   console.log(uniqArrByUserID);
    // }
    // if (uniqArrByDate.length) {
    //   console.log('Entry for the same Date exists already!');
    //   console.log(uniqArrByDate);
    // }
    // if (!uniqArrByUserID.length && !uniqArrByDate.length) {
    //   console.log('Success');
    //
    //   _.forEach(rowData, r => {
    //     r.created_by = JSON.parse(sessionStorage.getItem('user')).username;
    //     r.created_at = Date.now();
    //   });

    this.insertManyUsers(rowData);
    // }
  }

  insertManyUsers(data) {
    this.importAttendanceGQL
      .mutate({
        input: data
      })
      .subscribe( (val: any) => {
        if (val.data) {
          this.toastr.success('Data Saved', 'Success', { timeOut: 3000 });
          window.location.reload();
        }
      }, error => {
        this.toastr.error(error, 'Error', { timeOut: 5000 });
        setTimeout(__ => this.loadAttendances(), 1000);
      });
  }

}
