import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { BadmintonMatch } from '../badminton-match';
import { Game } from '../game';
import { UserService } from '../../account/user.service';
import { NavParams, Nav, ToastController } from 'ionic-angular';
import { MatchListComponent } from '../match-list/match-list.component';
import { MatchEditComponent } from '../match-edit/match-edit.component';
import { MatchSimulateComponent } from '../match-simulate/match-simulate.component';

@Component({
  selector: 'bme-match-detail',
  templateUrl: './match-detail.component.html'
})
export class MatchDetailComponent implements OnInit {
  courtImage = 'assets/imgs/badminton-court.jpg';
  hasAuthority = false;
  stopPolling = false;
  userMatches: BadmintonMatch[];
  match: BadmintonMatch;
  currentGame: Game;

  constructor(private _userService: UserService, private _matchService: MatchService,
    private _navParams: NavParams, private _nav: Nav, private _toastCtrl: ToastController) { }

  ngOnInit() {
    const id = +this._navParams.get('id');

    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._matchService.getMatchesByUser(+prop[0])
            .subscribe(
              badmintonMatches => {
                this.userMatches = badmintonMatches;
                this.loadMatch(id);
              },
              error => {
                this.loadMatch(id);
                this.showError(error);
              });
        } else {
          this.loadMatch(id);
        }
      });
    this.checkGame();
  }

  ionViewDidLeave() {
    this.stopPolling = true;
  }

  loadMatch(id: number) {
    this._matchService.getMatchById(id)
      .subscribe(
        badmintonMatch => {
          this.match = badmintonMatch;
          if (this.userMatches) {
            for (let i = 0; i < this.userMatches.length; i++) {
              if (this.userMatches[i].id === badmintonMatch.id) {
                this.hasAuthority = true;
              }
            }
          }
        },
        error => {
          this.showError(error);
        });
  }

  simulateMatch() {
    this._nav.push(MatchSimulateComponent, { 'id': this.match.id })
  }

  editMatch() {
    this._nav.push(MatchEditComponent, { 'id': this.match.id });
  }

  deleteMatch() {
    this._matchService.deleteMatch(this.match.id)
      .subscribe(
        badmintonmatch => {
          if (!badmintonmatch) {
            this._nav.push(MatchListComponent);
          }
        },
        error => {
          this.showError(error);
        });
  }

  checkGame() {
    if (!this.stopPolling) {
      setTimeout(() => {
        if (this.match.id) {
          this._matchService.getMatchById(this.match.id)
            .subscribe(
              badmintonmatch => {
                this.match = badmintonmatch;
                this.checkGame();
              },
              error => {
                this.checkGame();
                this.showError(error);
              });
        }
      }, 1000);
    }
  }

  getFontWeight(points1: number, points2: number): string {
    if (points1 > points2) {
      return 'bold';
    }
    return null;
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
