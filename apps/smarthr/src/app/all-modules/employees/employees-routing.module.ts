import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { EmployeePageContentComponent } from './all-employees/employee-page-content/employee-page-content.component';
import { EmployeeListComponent } from './all-employees/employee-list/employee-list.component';
import { EmployeeProfileComponent } from './all-employees/employee-profile/employee-profile.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { LeavesAdminComponent } from './leaves-admin/leaves-admin.component';
import { LeavesEmployeeComponent } from './leaves-employee/leaves-employee.component';
import { LeaveSettingsComponent } from './leave-settings/leave-settings.component';
import { AttendanceAdminComponent } from './attendance-admin/attendance-admin.component';
import { AttendanceEmployeeComponent } from './attendance-employee/attendance-employee.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationComponent } from './designation/designation.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { OvertimeComponent } from './overtime/overtime.component';
import { Role } from '../../_helpers/_models/user';
import { AuthGuard } from '../../_helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent,
    children: [
      {
        path: 'employeepage',
        component: EmployeePageContentComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.ADMIN, Role.HRMANAGER] }
      },
      {
        path: 'employeelist',
        component: EmployeeListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.ADMIN, Role.HRMANAGER] }
      },
      {
        path: 'employeeprofile',
        component: EmployeeProfileComponent
      },
      {
        path: 'holidays',
        component: HolidaysComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.ADMIN, Role.HRMANAGER] }
      },
      {
        path: 'adminleaves',
        component: LeavesAdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.ADMIN, Role.HRMANAGER] }
        },
      {
        path: 'employeeleaves',
        component: LeavesEmployeeComponent
      },
      {
        path: 'leavesettings',
        component: LeaveSettingsComponent
      },
      {
        path: 'attendanceadmin',
        component: AttendanceAdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.ADMIN, Role.HRMANAGER] }
      },
      {
        path: 'attendanceemployee',
        component: AttendanceEmployeeComponent
      },
      {
        path: 'departments',
        component: DepartmentsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.ADMIN] }
      },
      {
        path: 'designation',
        component: DesignationComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.ADMIN, Role.HRMANAGER] }
      },
      {
        path: 'timesheet',
        component: TimesheetComponent
      },
      {
        path: 'overtime',
        component: OvertimeComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
