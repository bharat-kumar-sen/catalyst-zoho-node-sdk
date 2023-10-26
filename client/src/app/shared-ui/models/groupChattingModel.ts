import {currentUser} from './current-user'

export class groupChattingMsg {
  _id?:string = '';
  userIds: any[] = [];
  authorId?:string = '';
  groupName:string ='';
  groupType:string = 'user'
  attachment = false;
  senderId?: string= '';
  message:string =''
}

// export interface userId {
//   id:string;
//   message:string;
// }
