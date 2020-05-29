import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordRetrievalPage } from './password-retrieval';

@NgModule({
  declarations: [
    PasswordRetrievalPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordRetrievalPage),
  ],
})
export class PasswordRetrievalPageModule {}
