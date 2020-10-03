import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { DeleteHolidayGQL, GET_HOLIDAYS_QUERY, RegisterHolidayGQL, UpdateHolidayGQL } from './holidays-gql.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
declare const $: any;

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HolidaysComponent implements OnInit, OnDestroy {
  lstHolidays: any[];
  url: any = 'holidays';
  public tempId: any;
  public editId: any;

  public srch = [];
  public statusValue;
  public pipe = new DatePipe('en-US');
  public addHolidayForm: FormGroup;
  public editHolidayForm: FormGroup;
  public editHolidayDate: any;
  addForm: FormGroup;

  rows = [];
  selected = [];
  columns: any[] = [
    { prop: 'title', name: 'Title' },
    { prop: 'holiday', name: 'Holiday' },
    { prop: 'day', name: 'Day' },
    { prop: 'date', name: 'Date' }
  ];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private registerHolidayGQL: RegisterHolidayGQL,
    private deleteHolidayGQL: DeleteHolidayGQL,
    private updateHolidayGQL: UpdateHolidayGQL,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadholidays();

    this.addForm = this.fb.group({
      _id: [''],
      title: ['', Validators.required],
      date: ['', Validators.required],
      paid: ['', Validators.required]
    });
  }

  // Get Employee  Api Call
  loadholidays() {

    this.apollo.watchQuery({
      query: GET_HOLIDAYS_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data) {
        this.rows = [];
        this.lstHolidays = response.data.getHolidays;
        this.rows = this.lstHolidays;
        this.srch = [...this.rows];
        this.cdRef.detectChanges();
      }
    });
  }

  // Add holidays Modal Api Call

  addholidays(f) {
    console.log(f);
    this.registerHolidayGQL
      .mutate({
        title: f.value.title,
        paid: f.value.paid,
        date: f.value.date,
        day: this.getDayOfWeek(f.value.date),
        created_by: JSON.parse(sessionStorage.getItem('user')).username,
        created_at: Date.now(),
      })
      .subscribe( (val: any) => {
        if (val.data.createHoliday) {
          $('#add_holiday').modal('hide');
          this.addForm.reset();
          this.toastr.success('Holidays added', 'Success');
          this.loadholidays();
        }
      }, error => console.log(error));
  }

  from(data) {
    this.editHolidayDate = this.pipe.transform(data, 'dd-MM-yyyy');
  }

  // Edit holidays Modal Api Call

  editHolidays(f) {

    this.updateHolidayGQL
      .mutate({
        id: f.value._id,
        title: f.value.title,
        paid: f.value.paid,
        date: f.value.date,
        day: this.getDayOfWeek(f.value.date),
        modified: {
          modified_by: JSON.parse(sessionStorage.getItem('user')).username,
          modified_at: Date.now()
        }
      })
      .subscribe( (val: any) => {
        if (val.data) {
          $('#edit_holiday').modal('hide');
          this.toastr.success('Holidays Updated succesfully', 'Success');
          this.loadholidays();
        }
      }, error => console.log(error));
  }

  // Delete holidays Modal Api Call

  deleteHolidays() {

    this.deleteHolidayGQL
      .mutate({
        id: this.tempId,
        modified: {
          modified_by: JSON.parse(sessionStorage.getItem('user')).username,
          modified_at: Date.now()
        }
      })
      .subscribe( (val: any) => {
        if (val.data.deleteHoliday) {
          $('#delete_holiday').modal('hide');
          this.toastr.success('Holidays Deleted', 'Success');
          this.loadholidays();
        }
      }, error => console.log(error));
  }

  // To Get The holidays Edit Id And Set Values To Edit Modal Form

  addReset() {
    this.addForm.reset();
  }

  edit(value) {
    this.addForm.reset();
    this.editId = value;
    const index = this.lstHolidays.findIndex((item) => {
      return item._id === value;
    });
    const toSetValues = this.lstHolidays[index];
    this.addForm.patchValue(toSetValues);
  }

  getDayOfWeek(date) {
    const dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }
}
