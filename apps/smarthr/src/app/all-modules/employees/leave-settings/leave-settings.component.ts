import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { AllModulesService } from '../../all-modules.service';
import {
  GET_LEAVETYPES_QUERY,
} from '../../settings/leave-type/leave-types-gql.service';
import { Apollo } from 'apollo-angular';

declare const $: any;
@Component({
  selector: 'app-leave-settings',
  templateUrl: './leave-settings.component.html',
  styleUrls: ['./leave-settings.component.css'],
})
export class LeaveSettingsComponent implements OnInit {
  public sourceProducts: any;
  public targetProducts: any;
  public url1: any = 'pickListNames';
  public url: any = 'customPolicy';
  public allCustomPolicy: any = [];
  public addCustomPolicyForm: FormGroup;
  public editCustomPolicy: FormGroup;
  public editId: any;
  public tempId: any;

  allLeaveType: any;

  constructor(
    private primengConfig: PrimeNGConfig,
    private allModuleService: AllModulesService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    // Leave Settings button show

    $(document).on('change', '.leave-box .onoffswitch-checkbox', function() {
      const id = $(this).attr('id').split('_')[1];
      if ($(this).prop('checked') == true) {
        $('#leave_' + id + ' .leave-edit-btn').prop('disabled', false);
        $('#leave_' + id + ' .leave-action .btn').prop('disabled', false);
      } else {
        $('#leave_' + id + ' .leave-action .btn').prop('disabled', true);
        $('#leave_' + id + ' .leave-cancel-btn')
          .parent()
          .parent()
          .find('input')
          .prop('disabled', true);
        $('#leave_' + id + ' .leave-cancel-btn')
          .closest('div.leave-right')
          .find('.leave-save-btn')
          .remove();
        $('#leave_' + id + ' .leave-cancel-btn')
          .removeClass('btn btn-white leave-cancel-btn')
          .addClass('leave-edit-btn')
          .text('Edit');
        $('#leave_' + id + ' .leave-edit-btn').prop('disabled', true);
      }
    });

    $('.leave-box .onoffswitch-checkbox').each(function() {
      const id = $(this).attr('id').split('_')[1];
      if ($(this).prop('checked') == true) {
        $('#leave_' + id + ' .leave-edit-btn').prop('disabled', false);
        $('#leave_' + id + ' .leave-action .btn').prop('disabled', false);
      } else {
        $('#leave_' + id + ' .leave-action .btn').prop('disabled', true);
        $('#leave_' + id + ' .leave-cancel-btn')
          .parent()
          .parent()
          .find('input')
          .prop('disabled', true);
        $('#leave_' + id + ' .leave-cancel-btn')
          .closest('div.leave-right')
          .find('.leave-save-btn')
          .remove();
        $('#leave_' + id + ' .leave-cancel-btn')
          .removeClass('btn btn-white leave-cancel-btn')
          .addClass('leave-edit-btn')
          .text('Edit');
        $('#leave_' + id + ' .leave-edit-btn').prop('disabled', true);
      }
    });
    if ($('#customleave_select').length > 0) {
      $('#customleave_select').multiselect();
    }
    if ($('#edit_customleave_select').length > 0) {
      $('#edit_customleave_select').multiselect();
    }
    this.primengConfig.ripple = true;
    this.getPickList();
    this.getCustomPolicy();

    // Add CustomPolicyForm Validation And Getting Values

    this.addCustomPolicyForm = this.formBuilder.group({
      addNames: ['', [Validators.required]],
      addDays: ['', [Validators.required]],
    });

    // Edit CustomPolicyForm Validation And Getting Values

    this.editCustomPolicy = this.formBuilder.group({
      editNames: ['', [Validators.required]],
      editDays: ['', [Validators.required]],
    });


    // MS
    this.getLeaveTypes();

  }

  // get pick list
  getPickList() {
    this.allModuleService.get(this.url1).subscribe((data) => {
      this.sourceProducts = data;
      this.targetProducts = [];
    });
  }

  // get custom policy
  getCustomPolicy() {
    this.allModuleService.get(this.url).subscribe((data) => {
      this.allCustomPolicy = data;
    });
  }

  // Add Custom Modal Api Call

  addCustom() {
    if (this.addCustomPolicyForm.valid) {
      const obj = {
        name: this.addCustomPolicyForm.value.addNames,
        days: this.addCustomPolicyForm.value.addDays,
      };
      this.allModuleService.add(obj, this.url).subscribe((data) => {});
      this.getCustomPolicy();
      $('#add_custom_policy').modal('hide');
      this.addCustomPolicyForm.reset();
      this.toastr.success('Custom Policy is added', 'Success');
    }
  }

  // Edit Custom Modal Api Call

  editCustom() {
    const obj = {
      name: this.editCustomPolicy.value.editNames,
      days: this.editCustomPolicy.value.editDays,
      id: this.editId,
    };
    this.allModuleService.update(obj, this.url).subscribe((data1) => {});
    this.getCustomPolicy();
    $('#edit_custom_policy').modal('hide');
    this.toastr.success('Custom Policy is edited', 'Success');
  }

  edit(value) {
    this.editId = value;
    const index = this.allCustomPolicy.findIndex((item) => {
      return item.id === value;
    });
    const toSetValues = this.allCustomPolicy[index];
    this.editCustomPolicy.setValue({
      editNames: toSetValues.name,
      editDays: toSetValues.days,
    });
  }

  // Delete Custom Modal Api Call

  deleteCustom() {
    this.allModuleService.delete(this.tempId, this.url).subscribe((data) => {
      this.getCustomPolicy();
      $('#delete_custom_policy').modal('hide');
      this.toastr.success('Custom Policy is deleted', 'Success');
    });
  }



  getLeaveTypes() {
    this.apollo.watchQuery({
      query: GET_LEAVETYPES_QUERY,
      variables: {
        pagination: {
          limit: 100
        }
      },
    }).valueChanges.subscribe((response: any) => {
      if (response.data.getLeaveTypes.length) {
        this.allLeaveType = response.data.getLeaveTypes;
      }
    }, error => this.toastr.error(error, 'Error'));
  }

}
