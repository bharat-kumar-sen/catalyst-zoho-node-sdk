import {currentUser} from './current-user'

export class oneToOneChatMsg {
  chatId?:'';
  senderInfo:currentUser = new currentUser();
  receiverInfo:currentUser = new currentUser();
  attachment = false;
  readStatus = 0;
  message=''
}
