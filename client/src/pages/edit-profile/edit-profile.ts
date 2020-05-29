import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  public urlAvatar: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.urlAvatar = '../assets/imgs/user.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  loadImageFromDevice(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.urlAvatar = reader.result;
      console.log(reader.result);
    };

    reader.onerror = (error) => {
    };
  };


}
