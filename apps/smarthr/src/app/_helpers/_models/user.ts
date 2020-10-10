export class User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  Role: {
    role_name: Role
    _id: string
  };
  token?: string;
}

export enum Role {
  ADMIN = 'Admin',
  HRMANAGER = 'HR Manager',
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee'
}
