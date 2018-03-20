import { Component, OnInit } from '@angular/core';
import { MatchService } from '../match.service';
import { BadmintonMatch } from '../badminton-match';
import { HttpErrorResponse } from '@angular/common/http';
import { NavParams, ToastController } from 'ionic-angular';

@Component({
  selector: 'bme-match-edit',
  templateUrl: './match-edit.component.html'
})
export class MatchEditComponent implements OnInit {
  matchUpdated = false;
  anyChanges = false;
  changeLocation = false;
  originalMatch: BadmintonMatch;
  match: BadmintonMatch;
  errorMessage: HttpErrorResponse;

  constructor(private _matchService: MatchService, private _navParams: NavParams, private _toastCtrl: ToastController) { }

  ngOnInit() {
    const id = +this._navParams.get('id');
    this._matchService.getMatchById(id)
      .subscribe(
        match => {
          this.organizeMatches(match);
        },
        error => {
          this.showError(error);
        });
  }

  checkForChanges() {
    this.anyChanges = false;
    for (const key in this.match) {
      if (this.match[key] !== this.originalMatch[key] && key !== 'games') {
        this.anyChanges = true;
      }
    }
    for (let i = 0; i < this.match.games.length; i++) {
      for (const key in this.match.games[i]) {
        if (this.match.games[i][key] !== this.originalMatch.games[i][key]) {
          this.anyChanges = true;
        }
      }
    }
  }

  updateMatch() {
    this._matchService.updateMatch(this.match)
      .subscribe(
        match => {
          this.showSuccess('Wedstrijd successvol opgeslagen!');
          this.anyChanges = false;
          this.organizeMatches(match);
        },
        error => {
          this.showError(error);
        });
  }

  organizeMatches(match: BadmintonMatch) {
    this.originalMatch = null;
    this.match = null;
    this.originalMatch = Object.assign({}, match, this.originalMatch);
    this.match = Object.assign({}, match, this.match);
    this.originalMatch.games = Object.assign([], match.games, this.originalMatch.games);
    this.match.games = Object.assign([], match.games, this.match.games);
    for (let i = 0; i < match.games.length; i++) {
      this.originalMatch.games[i] = Object.assign({}, match.games[i], this.originalMatch.games[i]);
      this.match.games[i] = Object.assign({}, match.games[i], this.match.games[i]);
    }
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
