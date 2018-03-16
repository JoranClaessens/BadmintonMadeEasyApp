import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Nav, ToastController } from 'ionic-angular';
import { HomeComponent } from '../../home/home.component';

@Component({
  selector: 'bme-account-login',
  templateUrl: './account-login.component.html'
})
export class AccountLoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(private _userService: UserService, private _nav: Nav, private _toastCtrl: ToastController) { }

  ngOnInit() {
  }

  login() {
    this._userService.login(this.email, this.password)
      .subscribe(
        user => {
          if (user) {
            this._userService.setUser(user);
            this._nav.push(HomeComponent);
          } else {
            this.showError('Email of wachtwoord is fout!');
          }
        },
        error => {
          this.showError('Email of wachtwoord is fout!');
        });
  }

  showError(message: string) {
    let toast = this._toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: "toast-danger"
    });
    toast.present(toast);
  }
}
