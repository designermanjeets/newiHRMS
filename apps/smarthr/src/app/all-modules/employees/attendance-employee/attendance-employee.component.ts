import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import {
  CreateAttendanceGQL,
  DeleteAttendanceGQL,
  GET_USER_ATTENDANCES_QUERY, ImportAttendanceGQL,
  UpdateAttendanceGQL, UploadAttendanceFileGQL
} from './attendance-gql.service';
import { ToastrService } from 'ngx-toastr';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { UploadOutput, UploadInput, UploadFile, UploaderOptions } from 'ngx-uploader';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare const $: any;

@Component({
  selector: 'app-attendance-employee',
  templateUrl: './attendance-employee.component.html',
  styleUrls: ['./attendance-employee.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceEmployeeComponent implements OnInit {

  rows: [] = [];
  srch: [] = [];
  allAttendances: [] = [];

  editForm: FormGroup;
  isEditModel = false;
  editTemp: any;

  selected = [];
  columns: any[] = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  options: UploaderOptions;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  fileToUpload: File = null;

  currDate = Date.now();
  todayTimeSheet: any;
  todayWeekSheet: any;
  todayMonthSheet: any;
  weekHours: number;
  monthHours: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private apollo: Apollo,
    private fb: FormBuilder,
    private createAttendanceGQL: CreateAttendanceGQL,
    private updateAttendanceGQL: UpdateAttendanceGQL,
    private deleteAttendanceGQL: DeleteAttendanceGQL,
    private uploadAttendanceFileGQL: UploadAttendanceFileGQL,
    private importAttendanceGQL: ImportAttendanceGQL,
  ) {
    this.options = { concurrency: 1, maxUploads: 3, maxFileSize: 1000000 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
  }

  ngOnInit() {
    this.initForm();
    this.loadAttendances();


    $('#edit_attendance').on('hide.bs.modal', () => {
      console.log(this.editTemp);
      this.editTemp = null;
      this.editForm.reset();
    });

  }

  initForm() {
    this.editForm = this.fb.group({
      _id: [''],
      date: ['', Validators.required],
      punchIn: ['', Validators.required],
      punchOut: ['', Validators.required],
    });
  }

  loadAttendances() {

    this.apollo.watchQuery({
      query: GET_USER_ATTENDANCES_QUERY,
      variables: {
        pagination: {
          id: JSON.parse(sessionStorage.getItem('user')).userid
        }
      },
    }).valueChanges
      .pipe(map ((value: any) => value.data.getUserAttendances))
      .subscribe((response: any) => {
        if (response) {
          console.log(response);
          this.rows = [];
          this.allAttendances = response;
          this.rows = response;
          this.srch = [...this.rows];

          this.todayTimeSheet = _.filter(this.allAttendances, val => moment(val.date).isSame(moment(this.currDate), 'day'))[0];
          this.todayWeekSheet = _.filter(this.allAttendances, val => moment(val.date).isSame(moment(this.currDate), 'week'));
          this.todayMonthSheet = _.filter(this.allAttendances, val => moment(val.date).isSame(moment(this.currDate), 'month'));

          const weekoutput = this.getDurationOutputHours(this.todayWeekSheet);
          const monthoutput = this.getDurationOutputHours(this.todayMonthSheet);

          this.weekHours = _.sumBy(['duration'], _.partial(_.sumBy, weekoutput)); // Get Total Hours of current Week
          this.monthHours = _.sumBy(['duration'], _.partial(_.sumBy, monthoutput)); // Get Total Hours of current Month


          // const moments = _.map(this.todayWeekSheet, d => moment(d, 'DD.MM.YYYY'));
          // const mostDistantDate = moment.max(moments);

          this.cdRef.detectChanges();
        }
      }, error => this.toastr.error(error, 'Error'));
   }

  getDurationOutputHours(durationArray) {
       return _.forEach(durationArray, dur => {
         const duration = moment.duration(moment(dur.punchOut).diff(moment(dur.punchIn)));
         dur.duration =  duration.asHours();
       });
   }

  getDifference(punchOut, punchIn) {

    const duration = moment.duration(moment(punchOut).diff(moment(punchIn)));
    const hours = duration.asHours();

    return hours;
  }



  editAttendance(form) {

  }

  reqCorrection(row) {
    this.isEditModel = true;
    this.editTemp = JSON.parse(JSON.stringify(row));
    this.editTemp.date = moment(this.editTemp.punchIn).format('MM-DD-YYYY');
    this.editTemp.punchIn = moment(this.editTemp.punchIn).format('hh:mm A');
    this.editTemp.punchOut = moment(this.editTemp.punchOut).format('hh:mm A');
    $("#edit_attendance").modal('show');
    $('#edit_attendance').on('shown.bs.modal', () => {
      this.editForm.patchValue(this.editTemp);
    });
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
    console.log(this.files);
    this.uploadAttendanceFileGQL
      .mutate({
        file: this.files[0].nativeFile
      }).pipe(
        map((val: any) => val.data.uploadAttendanceFile)
      )
      .subscribe( (val: any) => {
        if (val) {
          console.log(val);
          this.onImportgetData(val);
        }
      }, error => {
        console.log(error);
      });
  }


  onImportgetData(rowData) {
    console.log(rowData);
    rowData.forEach((r, i) => {
      if (r.date instanceof Date && !isNaN(r.date)) {
        // console.log('valid Date!');
      } else {
        // console.log('Invalid!'); // But Convert First
        r.date = moment(r.date, 'DD MM YYYY');
      }
      delete r.__typename;
    });

    const uniqArrByUserID = _.difference(rowData, _.uniqBy(rowData, 'user_ID'), 'user_ID');
    const uniqArrByDate = _.difference(rowData, _.uniqBy(rowData, 'date'), 'date');

    if (uniqArrByUserID.length) {
      console.log('Duplicate User ID');
      console.log(uniqArrByUserID);
    }
    if (uniqArrByDate.length) {
      console.log('Entry for the same Date exists already!');
      console.log(uniqArrByDate);
    }
    if (!uniqArrByUserID.length && !uniqArrByDate.length) {
      console.log('Success');

      _.forEach(rowData, r => {
        r.created_by = JSON.parse(sessionStorage.getItem('user')).userid;
        r.created_at = Date.now();
      });

      this.insertManyUsers(rowData);
    }
  }

  insertManyUsers(data) {
    this.importAttendanceGQL
      .mutate({
        input: data
      })
      .subscribe( (val: any) => {
        console.log(val.data);
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
