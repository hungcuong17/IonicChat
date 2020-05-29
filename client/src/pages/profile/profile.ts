import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public urlAvatar: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, ) {
  }


  ionViewWillEnter() {
    this.urlAvatar = '../assets/imgs/user.png';
  }

  editProfile() {
    this.navCtrl.push("EditProfilePage")
  }

  logout() {
    this.navCtrl.push('LoginPage');
    window.location.reload(true);
  }
}
