import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InviteFriendPage } from './invite-friend';

@NgModule({
  declarations: [
    InviteFriendPage,
  ],
  imports: [
    IonicPageModule.forChild(InviteFriendPage),
  ],
})
export class InviteFriendPageModule {}
