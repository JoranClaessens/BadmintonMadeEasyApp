import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { BadmintonMatch } from '../badminton-match';
import { UserService } from '../../account/user.service';
import { Nav, ToastController } from 'ionic-angular';
import { MatchCreateComponent } from '../match-create/match-create.component';
import { MatchDetailComponent } from '../match-detail/match-detail.component';

@Component({
  selector: 'bme-match-list',
  templateUrl: './match-list.component.html'
})
export class MatchListComponent implements OnInit {
  loggedIn = false;
  selectedMatchTab: number;
  userMatchesCount = 0;
  matches: BadmintonMatch[];
  customWarningMessage: string;
  currentDate: Date = new Date();

  constructor(private _userService: UserService, private _matchService: MatchService, private _nav: Nav, private _toastCtrl: ToastController) { }

  ngOnInit() {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this.loggedIn = true;
          this.loadAllMatches(+prop[0]);
        } else {
          this.loadAllMatches(null);
        }
      });
  }

  loadAllMatches(userId: number) {
    this.selectedMatchTab = 1;
    if (userId) {
      this._matchService.getMatchesByUser(userId)
        .subscribe(
          badmintonMatches => {
            this.userMatchesCount = badmintonMatches.length;
            this.loadAllMatches(null);
          },
          error => {
            this.loadAllMatches(null);
            this.showError(error);
          });
    } else {
      this._matchService.getMatches()
        .subscribe(
          badmintonMatches => {
            this.matches = badmintonMatches;
            this.convertToMinutes();
          },
          error => {
            this.showError(error);
          });
    }
  }

  loadUserMatches() {
    this.selectedMatchTab = 2;
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._matchService.getMatchesByUser(+prop[0])
            .subscribe(
              badmintonMatches => {
                this.matches = badmintonMatches;
                this.userMatchesCount = this.matches.length;
                this.convertToMinutes();
              },
              error => {
                this.showError(error);
              });
        } else {
          this.matches = null;
        }
      });
  }

  createMatch() {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._nav.push(MatchCreateComponent);
        } else {
          this.showWarning('U moet zich eerst aanmelden of registreren voordat u een wedstrijd kan aanmaken!');
        }
      });
  }

  matchDetail(id: number) {
    this._nav.push(MatchDetailComponent, { 'id': id });
  }

  convertToMinutes() {
    for (const match of this.matches) {
      if (match.matchCreated) {
        const eventStartTime = new Date(match.matchCreated);
        const dateNow = new Date();
        let duration = dateNow.valueOf() - eventStartTime.valueOf();
        if (duration < 3600000) {
          duration = Math.floor(duration / (1000 * 60) % 60);
          if (duration !== 0) {
            (<any>match).duration = duration;
          } else {
            (<any>match).duration = '0';
          }
        } else {
          (<any>match).duration = '-1';
        }
      }
    }
  }

  getFontWeight(points1: number, points2: number): string {
    if (points1 > points2) {
      return 'bold';
    }
    return null;
  }

  swipeEvent(e) {
    if (e.direction === 4 && this.selectedMatchTab === 2) {
      this.loadAllMatches(null);
    } else if (e.direction === 2 && this.selectedMatchTab === 1) {
      this.loadUserMatches();
    }
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
