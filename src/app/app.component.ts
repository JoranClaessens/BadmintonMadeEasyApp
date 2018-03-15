import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomeComponent } from './home/home.component';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  rootPage: any = HomeComponent;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
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
    this.nav.push(HomeComponent);
  }

  navigateTournaments() {
    this.nav.push(HomeComponent);
  }

  navigateCompetitions() {
    this.nav.push(HomeComponent);
  }

  navigateAccountLogin() {
    this.nav.push(HomeComponent);
  }

  navigateAccountCreate() {
    this.nav.push(HomeComponent);
  }
}
