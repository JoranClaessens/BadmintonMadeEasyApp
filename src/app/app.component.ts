import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, Nav, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomeComponent } from './home/home.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';
import { AccountLoginComponent } from './account/account-login/account-login.component';
import { User } from './account/user';
import { UserService } from './account/user.service';
import { MatchListComponent } from './matches/match-list/match-list.component';
import { TournamentListComponent } from './tournaments/tournament-list/tournament-list.component';
import { CompetitionListComponent } from './competitions/competition-list/competition-list.component';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav;
  rootPage: any = HomeComponent;
  user: User;

  constructor(private _userService: UserService, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private _toastCtrl: ToastController) {
    this.initializeApp();
  }

  ngOnInit() {
    this.nav.viewDidEnter.subscribe((view) => {
      this._userService.getUser()
        .then(prop => {
          if (prop[0] && prop[1]) {
            this.user = new User(prop[1], null);
            this.user.id = +prop[0];
          } else {
            this.user = null;
          }
        })
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  navigateHome() {
    this.nav.push(HomeComponent);
  }

  navigateMatches() {
    this.nav.push(MatchListComponent);
  }

  navigateTournaments() {
    this.nav.push(TournamentListComponent);
  }

  navigateCompetitions() {
    this.nav.push(CompetitionListComponent);
  }

  navigateAccountLogin() {
    this.nav.push(AccountLoginComponent);
  }

  navigateAccountCreate() {
    this.nav.push(AccountCreateComponent);
  }

  logout() {
    this.showSuccess("Succesvol afgemeld!");
    this.user = null;
    this._userService.setUser(null);
    this.nav.push(HomeComponent);
  }

  showSuccess(message: string) {
    let toast = this._toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: "toast-success"
    });
    toast.present(toast);
  }
}
