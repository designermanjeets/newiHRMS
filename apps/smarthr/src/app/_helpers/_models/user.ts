export class User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: Role;
  token?: string;
}

export enum Role {
  ADMIN = 'Admin',
  HRMANAGER = 'Hr Manager',
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee'
}
