import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SingupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-singup',
  templateUrl: 'singup.html',
})
export class SingupPage {
  // public notication = "notication"

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingupPage');
  }
  backLoginPage(){
    this.navCtrl.setRoot("LoginPage")
  }
  signup(){
    document.getElementById("notication").innerHTML = "Đăng ký tài khoản thành công"
  }

}
