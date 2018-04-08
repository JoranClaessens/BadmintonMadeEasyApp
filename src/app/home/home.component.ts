import { Component, OnInit, ViewChild } from '@angular/core';
import { Slides, Nav, ToastController } from 'ionic-angular';
import { MatchListComponent } from '../matches/match-list/match-list.component';
import { UserService } from '../account/user.service';
import { MatchCreateComponent } from '../matches/match-create/match-create.component';
import { TournamentListComponent } from '../tournaments/tournament-list/tournament-list.component';
import { TournamentCreateComponent } from '../tournaments/tournament-create/tournament-create.component';
import { CompetitionCreateComponent } from '../competitions/competition-create/competition-create.component';
import { CompetitionListComponent } from '../competitions/competition-list/competition-list.component';

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

  startTournament() {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._nav.push(TournamentCreateComponent);
        } else {
          this.showWarning('U moet zich eerst aanmelden of registreren voordat u een wedstrijd kan aanmaken!');
        }
      });
  }

  searchTournament() {
    this._nav.push(TournamentListComponent);
  }

  startCompetition() {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._nav.push(CompetitionCreateComponent);
        } else {
          this.showWarning('U moet zich eerst aanmelden of registreren voordat u een competitiepartij kan aanmaken!');
        }
      });
  }

  searchCompetition() {
    this._nav.push(CompetitionListComponent);
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
      position: 'bottom',
      cssClass: "toast-warning"
    });
    toast.present(toast);
  }
}
