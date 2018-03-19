import { Component, OnInit, ViewChild } from '@angular/core';
import { Slides, Nav, ToastController } from 'ionic-angular';
import { MatchListComponent } from '../matches/match-list/match-list.component';
import { UserService } from '../account/user.service';
import { MatchCreateComponent } from '../matches/match-create/match-create.component';

@Component({
  selector: 'bme-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  @ViewChild(Slides) slides: Slides;

  constructor(private _userService: UserService, private _nav: Nav, private _toastCtrl: ToastController) { }

  ngOnInit() {

  }

  startMatch() {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._nav.push(MatchCreateComponent);
        } else {
          this.showWarning('U moet zich eerst aanmelden of registreren voordat u een wedstrijd kan aanmaken!');
        }
      });
  }

  searchMatch() {
    this._nav.push(MatchListComponent);
  }

  ionViewDidEnter() {
    this.keepSliding();
  }

  keepSliding() {
    setTimeout(() => {
      if (!this.slides.isEnd()) {
        this.slides.slideNext(1000);
      } else {
        this.slides.slideTo(0, 1000);
      }
      this.keepSliding();
    }, 4000);
  }

  showWarning(message: string) {
    let toast = this._toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: "toast-warning"
    });
    toast.present(toast);
  }
}
