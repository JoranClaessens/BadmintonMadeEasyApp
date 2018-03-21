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
import { MatchEditComponent } from './matches/match-edit/match-edit.component';
import { MatchSimulateComponent } from './matches/match-simulate/match-simulate.component';
import { TournamentListComponent } from './tournaments/tournament-list/tournament-list.component';
import { TournamentCreateComponent } from './tournaments/tournament-create/tournament-create.component';
import { TournamentDetailComponent } from './tournaments/tournament-detail/tournament-detail.component';
import { TournamentService } from './tournaments/tournament.service';

@NgModule({
  declarations: [
    MyApp,
    HomeComponent,
    AccountCreateComponent,
    AccountLoginComponent,
    MatchListComponent,
    MatchCreateComponent,
    MatchDetailComponent,
    MatchEditComponent,
    MatchSimulateComponent,
    TournamentListComponent,
    TournamentCreateComponent,
    TournamentDetailComponent
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
    MatchDetailComponent,
    MatchEditComponent,
    MatchSimulateComponent,
    TournamentListComponent,
    TournamentCreateComponent,
    TournamentDetailComponent
  ],
  providers: [
    UserService,
    MatchService,
    TournamentService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
