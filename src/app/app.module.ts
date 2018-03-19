import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomeComponent } from './home/home.component';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { AccountCreateComponent } from './account/account-create/account-create.component';
import { UserService } from './account/user.service';
import { AccountLoginComponent } from './account/account-login/account-login.component';
import { MatchListComponent } from './matches/match-list/match-list.component';
import { MatchService } from './matches/match.service';
import { MatchCreateComponent } from './matches/match-create/match-create.component';
import { MatchDetailComponent } from './matches/match-detail/match-detail.component';

@NgModule({
  declarations: [
    MyApp,
    HomeComponent,
    AccountCreateComponent,
    AccountLoginComponent,
    MatchListComponent,
    MatchCreateComponent,
    MatchDetailComponent
],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomeComponent,
    AccountCreateComponent,
    AccountLoginComponent,
    MatchListComponent,
    MatchCreateComponent,
    MatchDetailComponent
  ],
  providers: [
    UserService,
    MatchService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
