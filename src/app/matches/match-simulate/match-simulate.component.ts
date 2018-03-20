import { Component, OnInit } from '@angular/core';
import { BadmintonMatch } from '../badminton-match';
import { Game } from '../game';
import { HttpErrorResponse } from '@angular/common/http';
import { MatchService } from '../match.service';
import { GamePK } from '../gamePk';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'bme-match-simulate',
  templateUrl: './match-simulate.component.html'
})
export class MatchSimulateComponent implements OnInit {
  courtImage = 'assets/imgs/badminton-court.jpg';
  match: BadmintonMatch;
  gameFinished = false;
  matchFinished = false;
  currentGame: Game;
  newGamePk: GamePK;
  errorMessage: HttpErrorResponse;
  serviceTeam1 = false;
  serviceTeam2 = false;
  showSwitch1Btn = false;
  showSwitch2Btn = false;
  showSwitch3Btn = false;
  showSwitch4Btn = false;

  constructor(private _matchService: MatchService, private _navParams: NavParams) { }

  ngOnInit() {
    this.serviceTeam1 = true;
    const id = +this._navParams.get('id');
    this._matchService.getMatchById(id)
      .subscribe(
        badmintonMatch => {
          this.match = badmintonMatch;
          this.currentGame = badmintonMatch.games[badmintonMatch.games.length - 1];
          this.checkGame();
        },
        error => {
          this.errorMessage = <any>error;
        });
  }

  startMatch() {
    this.match.matchCreated = new Date();
    this._matchService.updateMatch(this.match)
      .subscribe(
        badmintonMatch => {
          console.log('test');
        },
        error => {
          this.errorMessage = <any>error;
        });
  }

  endMatch() {
    this.match.matchFinished = new Date();
    this._matchService.updateMatch(this.match)
      .subscribe(
        badmintonMatch => {
          console.log('test');
        },
        error => {
          this.errorMessage = <any>error;
        });
  }

  pointsTeam1More() {
    if (this.match.type !== 'MEN_SINGLE' && this.match.type !== 'WOMEN_SINGLE') {
      this.checkDoublePlayerLocations(1);
    }
    this.match.serviceTeam1 = true;
    if (this.match.type === 'MEN_SINGLE' || this.match.type === 'WOMEN_SINGLE') {
      this.checkSinglePlayerLocations();
    }

    if (this.currentGame.pointsTeam1 - this.currentGame.pointsTeam2 < 2 || this.currentGame.pointsTeam1 < 21) {
      this.currentGame.pointsTeam1++;
      this.updateGame();
    }
  }

  pointsTeam2More() {
    if (this.match.type !== 'MEN_SINGLE' && this.match.type !== 'WOMEN_SINGLE') {
      this.checkDoublePlayerLocations(2);
    }
    this.match.serviceTeam1 = false;
    if (this.match.type === 'MEN_SINGLE' || this.match.type === 'WOMEN_SINGLE') {
      this.checkSinglePlayerLocations();
    }

    if (this.currentGame.pointsTeam2 - this.currentGame.pointsTeam1 < 2 || this.currentGame.pointsTeam2 < 21) {
      this.currentGame.pointsTeam2++;
      this.updateGame();
    }
  }

  pointsTeam1Less() {
    this.checkSinglePlayerLocations();
    this.currentGame.pointsTeam1--;
    this.updateGame();
  }

  pointsTeam2Less() {
    this.checkSinglePlayerLocations();
    this.currentGame.pointsTeam2--;
    this.updateGame();
  }

  updateService(team: number) {
    if (team === 1) {
      this.match.serviceTeam1 = true;
    } else {
      this.match.serviceTeam1 = false;
    }
    this._matchService.updateMatch(this.match)
      .subscribe(
        badmintonMatch => {
          console.log('test');
        },
        error => {
          this.errorMessage = <any>error;
        });
  }

  switchSides(team: number) {
    if (team === 1) {
      this.match.player1Left = !this.match.player1Left;
    } else {
      this.match.player2Left = !this.match.player2Left;
    }
    this._matchService.updateMatch(this.match)
      .subscribe(
        badmintonMatch => {
          console.log('test');
        },
        error => {
          this.errorMessage = <any>error;
        });
  }

  updateGame() {
    this._matchService.updateGame(this.currentGame)
      .subscribe(
        game => {
          this.checkGame();
        },
        error => {
          this.errorMessage = <any>error;
        });
    this._matchService.updateMatch(this.match)
      .subscribe(
        badmintonMatch => {
          this.checkGame();
        },
        error => {
          this.errorMessage = <any>error;
        });
  }

  newGame() {
    this.match.player1Left = false;
    this.match.player2Left = false;
    this._matchService.updateMatch(this.match)
      .subscribe(
        badmintonMatch => {
          this.newGamePk = this.currentGame.gamePk;
          this.newGamePk.gameId = this.newGamePk.gameId + 1;
          this._matchService.createGame(new Game(this.newGamePk, 0, 0))
            .subscribe(
              game => {
                this._matchService.getMatchById(this.match.id)
                  .subscribe(
                    badmintonMatch2 => {
                      this.match = badmintonMatch2;
                      this.currentGame = badmintonMatch2.games[badmintonMatch2.games.length - 1];
                    },
                    error => {
                      this.errorMessage = <any>error;
                    });
                this.gameFinished = false;
              },
              error => {
                this.errorMessage = <any>error;
              });
        },
        error => {
          this.errorMessage = <any>error;
        });
  }

  checkGame() {
    if ((this.currentGame.pointsTeam1 > 20 && this.currentGame.pointsTeam1 - this.currentGame.pointsTeam2 >= 2)
      || (this.currentGame.pointsTeam2 > 20 && this.currentGame.pointsTeam2 - this.currentGame.pointsTeam1 >= 2)
      || this.currentGame.pointsTeam1 === 30 || this.currentGame.pointsTeam2 === 30) {
      this.gameFinished = true;
      this._matchService.getMatchById(this.match.id)
        .subscribe(
          badmintonMatch => {
            this.match = badmintonMatch;
            let gamesWonTeam1 = 0;
            let gamesWonTeam2 = 0;
            for (let i = 0; i < this.match.games.length; i++) {
              if (this.match.games[i].pointsTeam1 > this.match.games[i].pointsTeam2) {
                gamesWonTeam1++;
              }

              if (this.match.games[i].pointsTeam1 < this.match.games[i].pointsTeam2) {
                gamesWonTeam2++;
              }
            }

            if (gamesWonTeam1 === 2 || gamesWonTeam2 === 2) {
              this.matchFinished = true;
            }
          },
          error => {
            this.errorMessage = <any>error;
          });
    } else {
      this.gameFinished = false;
    }
  }

  checkSinglePlayerLocations() {
    if ((this.match.serviceTeam1 && this.currentGame.pointsTeam1 % 2 === 0)
      || (!this.match.serviceTeam1 && this.currentGame.pointsTeam2 % 2 === 0)) {
      this.match.player1Left = true;
      this.match.player2Left = true;
    } else {
      this.match.player1Left = false;
      this.match.player2Left = false;
    }
  }

  checkDoublePlayerLocations(id: number) {
    if (id === 1) {
      if (this.match.serviceTeam1) {
        this.match.player1Left = !this.match.player1Left;
      }
    } else {
      if (!this.match.serviceTeam1) {
        this.match.player2Left = !this.match.player2Left;
      }
    }
  }

  getFontWeight(points1: number, points2: number): string {
    if (points1 > points2) {
      return 'bold';
    }
    return null;
  }
}
