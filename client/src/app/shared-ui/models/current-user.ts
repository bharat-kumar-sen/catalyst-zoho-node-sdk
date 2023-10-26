import { environment } from '../../../environments/environment';

// export class bgColor {
// }
// export class currentUser extends bgColor {
export class currentUser {
  _id?: string;
  bgColor?: string;
  username: string = 'sadff';
  first_name: string = 'sadff';
  last_name: string = 'asdf';
  email: string = 'sadf@gmail.com';
  phoneNumber: string = '333333333';
  password: string = 'test';
  confirm_password: string = 'test';
  gender: string = 'male';
  profileImage?: any = '';
  profileOldImage?: any = '';
  dob: Date = new Date();
  status: number = 1;
  userStatus?: string = 'online';
  role: any = environment.role.userRole;
}
