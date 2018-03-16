import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { Nav, ToastController } from 'ionic-angular';
import { HomeComponent } from '../../home/home.component';

@Component({
  selector: 'bme-account-create',
  templateUrl: './account-create.component.html'
})
export class AccountCreateComponent implements OnInit {
  email: string;
  password: string;

  constructor(private _userService: UserService, private _nav: Nav, private _toastCtrl: ToastController) { }

  ngOnInit() {
  }

  createAccount() {
    this._userService.getUserByEmail(this.email)
      .subscribe(
        user => {
          if (!user) {
            this.createUser();
          } else {
            this.showError('Email bestaat al!');
          }
        });
  }

  createUser() {
    this._userService.createUser(new User(this.email, this.password))
      .subscribe(
        user => {
          if (user) {
            this._userService.setUser(user);
            this._nav.push(HomeComponent);
          }
        },
        error => {
          this.showError(error);
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
