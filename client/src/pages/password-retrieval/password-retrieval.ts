import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PasswordRetrievalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password-retrieval',
  templateUrl: 'password-retrieval.html',
})
export class PasswordRetrievalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordRetrievalPage');
  }

  backLoginPage() {
    this.navCtrl.setRoot("LoginPage")
  }

  passwordRetrieval(){
    document.getElementById("notication").innerHTML = "Mật khẩu mới đã được gửi đến email"
  }

}
