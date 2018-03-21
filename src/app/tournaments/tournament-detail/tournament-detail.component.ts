import { Component, OnInit } from '@angular/core';
import { TournamentPlayer } from '../tournament-player';
import { MatchService } from '../../matches/match.service';
import { BadmintonMatch } from '../../matches/badminton-match';
import { TournamentService } from '../tournament.service';
import { Tournament } from '../tournament';
import { UserService } from '../../account/user.service';
import { Nav, NavParams, ToastController } from 'ionic-angular';
import { MatchDetailComponent } from '../../matches/match-detail/match-detail.component';
import { TournamentListComponent } from '../tournament-list/tournament-list.component';

@Component({
  selector: 'bme-tournament-detail',
  templateUrl: './tournament-detail.component.html'
})
export class TournamentDetailComponent implements OnInit {
  hasAuthority = false;
  showInput = false;
  stopPolling = false;
  tournament: Tournament;
  userTournaments: Tournament[];
  tournamentPlayers: TournamentPlayer[];
  badmintonMatches = new Array<BadmintonMatch>();
  rounds: number[];
  round1: number;
  round2: number;
  round3: number;
  round4: number;
  round5: number;
  round6: number;
  round7: number;
  round8: number;
  round9: number;

  constructor(private _tournamentService: TournamentService, private _matchService: MatchService, private _userService: UserService,
    private _nav: Nav, private _navParams: NavParams, private _toastCtrl: ToastController) { }

  ngOnInit() {
    const id = +this._navParams.get('id');

    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._tournamentService.getTournamentsByUser(+prop[0])
            .subscribe(
              tournaments => {
                this.userTournaments = tournaments;
                this.initialize(id);
              },
              error => {
                this.initialize(id);
                this.showError(error);
              });
        } else {
          this.initialize(id);
        }
      });
    this.pollTournament();
  }

  ionViewDidLeave() {
    this.stopPolling = true;
  }

  createBracket() {
    if (this.tournament.numberOfTeams <= 2) {
      this.rounds = Array(2).fill(1).map((x, i) => i + 1);
      this.round1 = 1;
      this.round2 = 0;
    } else if (this.tournament.numberOfTeams <= 4) {
      this.rounds = Array(3).fill(1).map((x, i) => i + 1);
      this.round1 = 2;
      this.round2 = 1;
      this.round3 = 0;
    } else if (this.tournament.numberOfTeams <= 8) {
      this.rounds = Array(4).fill(1).map((x, i) => i + 1);
      this.round1 = 4;
      this.round2 = 2;
      this.round3 = 1;
      this.round4 = 0;
    } else if (this.tournament.numberOfTeams <= 16) {
      this.rounds = Array(5).fill(1).map((x, i) => i + 1);
      this.round1 = 8;
      this.round2 = 4;
      this.round3 = 2;
      this.round4 = 1;
      this.round5 = 0;
    } else if (this.tournament.numberOfTeams <= 32) {
      this.rounds = Array(6).fill(1).map((x, i) => i + 1);
      this.round1 = 16;
      this.round2 = 8;
      this.round3 = 4;
      this.round4 = 2;
      this.round5 = 1;
      this.round6 = 0;
    } else if (this.tournament.numberOfTeams <= 64) {
      this.rounds = Array(7).fill(1).map((x, i) => i + 1);
      this.round1 = 32;
      this.round2 = 16;
      this.round3 = 8;
      this.round4 = 4;
      this.round5 = 2;
      this.round6 = 1;
      this.round7 = 0;
    } else if (this.tournament.numberOfTeams <= 128) {
      this.rounds = Array(8).fill(1).map((x, i) => i + 1);
      this.round1 = 64;
      this.round2 = 32;
      this.round3 = 16;
      this.round4 = 8;
      this.round5 = 4;
      this.round6 = 2;
      this.round7 = 1;
      this.round8 = 0;
    } else if (this.tournament.numberOfTeams <= 256) {
      this.rounds = Array(9).fill(1).map((x, i) => i + 1);
      this.round1 = 128;
      this.round2 = 64;
      this.round3 = 32;
      this.round4 = 16;
      this.round5 = 8;
      this.round6 = 4;
      this.round7 = 2;
      this.round8 = 1;
      this.round9 = 0;
    }
  }

  getMatchRounds(round: number): number[] {
    switch (round) {
      case 1: if (!this.checkLastRound(this.round1)) { return Array(this.round1).fill(1).map((x, i) => i + 1); } else { return [0]; }
      case 2: if (!this.checkLastRound(this.round2)) { return Array(this.round2).fill(1).map((x, i) => i + 1); } else { return [0]; }
      case 3: if (!this.checkLastRound(this.round3)) { return Array(this.round3).fill(1).map((x, i) => i + 1); } else { return [0]; }
      case 4: if (!this.checkLastRound(this.round4)) { return Array(this.round4).fill(1).map((x, i) => i + 1); } else { return [0]; }
      case 5: if (!this.checkLastRound(this.round5)) { return Array(this.round5).fill(1).map((x, i) => i + 1); } else { return [0]; }
      case 6: if (!this.checkLastRound(this.round6)) { return Array(this.round6).fill(1).map((x, i) => i + 1); } else { return [0]; }
      case 7: if (!this.checkLastRound(this.round7)) { return Array(this.round7).fill(1).map((x, i) => i + 1); } else { return [0]; }
      case 8: if (!this.checkLastRound(this.round8)) { return Array(this.round8).fill(1).map((x, i) => i + 1); } else { return [0]; }
      case 9: if (!this.checkLastRound(this.round9)) { return Array(this.round9).fill(1).map((x, i) => i + 1); } else { return [0]; }
    }
  }

  getPlayer(round: number, match: number, position: number): string {
    if (this.tournament.type === 'MEN_SINGLE' || this.tournament.type === 'WOMEN SINGLE') {
      for (let i = 0; i < this.tournament.players.length; i++) {
        if (round === this.tournament.players[i].round && match === Math.ceil(this.tournament.players[i].position / 2) &&
          position === this.tournament.players[i].position % 2) {
          return this.tournament.players[i].name;
        }
      }
    } else {
      for (let i = 0; i < this.tournament.players.length; i++) {
        if (round === this.tournament.players[i].round && match === Math.ceil(this.tournament.players[i].position / 4) &&
          position === this.tournament.players[i].position % 4) {
          return this.tournament.players[i].name;
        }
      }
    }
    return null;
  }

  getMatch(player1: string, player2: string, player3: string, player4: string): BadmintonMatch {
    if (this.tournament.type === 'MEN_SINGLE' || this.tournament.type === 'WOMEN SINGLE') {
      for (let i = 0; i < this.tournament.matches.length; i++) {
        if (player1 && player2 && this.tournament.matches[i].player1 && this.tournament.matches[i].player2) {
          if (this.tournament.matches[i].player1 === player1 && this.tournament.matches[i].player2 === player2) {
            return this.tournament.matches[i];
          }
        }
      }
    } else {
      for (let i = 0; i < this.tournament.matches.length; i++) {
        if (player1 && player2 && player3 && player4
          && this.tournament.matches[i].player1 && this.tournament.matches[i].player2
          && this.tournament.matches[i].player3 && this.tournament.matches[i].player4) {
          if (this.tournament.matches[i].player1 === player1 && this.tournament.matches[i].player2 === player2
            && this.tournament.matches[i].player3 === player3 && this.tournament.matches[i].player4 === player4) {
            return this.tournament.matches[i];
          }
        }
      }
    }
    return null;
  }

  getGamePoints(match: BadmintonMatch) {
    if (match) {
      let returnString = '';
      for (let i = 0; i < match.games.length; i++) {
        returnString += match.games[i].pointsTeam1 + '-' + match.games[i].pointsTeam2 + ' ';
      }
      return returnString;
    } else {
      return null;
    }
  }

  startMatch(player1: string, player2: string, player3: string, player4: string) {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._tournamentService.createMatch(new BadmintonMatch(this.tournament.title, this.tournament.type,
            player1, player2, player3, player4, this.tournament.street, this.tournament.city, null),
            +prop[0], this.tournament.id)
            .subscribe(
              badmintonMatch => {
                if (badmintonMatch) {
                  this._nav.push(MatchDetailComponent, { 'id': badmintonMatch.id } )
                }
              },
              error => {
                this.showError(error);
              });
        }
      });


  }

  checkLastRound(matchRound: number): boolean {
    if (matchRound === 0) {
      return true;
    }
    return false;
  }

  scheduleTournament() {
    this.tournament.scheduled = true;
    for (let i = 1; i <= this.getMatchRounds(1).length; i++) {
      if (this.tournament.type === 'MEN_SINGLE' || this.tournament.type === 'WOMEN SINGLE') {
        if (!this.getPlayer(1, i, 1) && this.getPlayer(1, i, 0)) {
          this.tournament.players.push(new TournamentPlayer(this.getPlayer(1, i, 0), 2, i));
        } else if (this.getPlayer(1, i, 1) && !this.getPlayer(1, i, 0)) {
          this.tournament.players.push(new TournamentPlayer(this.getPlayer(1, i, 1), 2, i));
        }
      } else {
        if (this.getPlayer(1, i, 1) && this.getPlayer(1, i, 2) && !this.getPlayer(1, i, 3) && !this.getPlayer(1, i, 0)) {
          this.tournament.players.push(new TournamentPlayer(this.getPlayer(1, i, 1), 2, i));
          this.tournament.players.push(new TournamentPlayer(this.getPlayer(1, i, 2), 2, i + 1));
        } else if (!this.getPlayer(1, i, 1) && !this.getPlayer(1, i, 2) && this.getPlayer(1, i, 3) && this.getPlayer(1, i, 0)) {
          this.tournament.players.push(new TournamentPlayer(this.getPlayer(1, i, 3), 2, i));
          this.tournament.players.push(new TournamentPlayer(this.getPlayer(1, i, 0), 2, i + 1));
        }
      }
    }
    this.updateTournament();
  }

  updateTournamentPlayer(newValue: string, round: number, match: number, position: number, newPosition: number) {
    const player = this.getPlayer(round, match, position);
    if (player) {
      for (let i = 0; i < this.tournament.players.length; i++) {
        if (this.tournament.players[i].name === player) {
          if (newValue && newValue !== '') {
            this.tournament.players[i].name = newValue;
            this.updateTournament();
          } else {
            this._tournamentService.deleteTournamentPlayer(this.tournament.players[i])
              .subscribe(
                tournamentPlayer => {
                  if (!tournamentPlayer) {
                    this.tournament.players.splice(i, 1);
                    this.updateTournament();
                  }
                },
                error => {
                  this.showError(error);
                });
          }
        }
      }
    } else {
      if (newValue && newValue !== '') {
        this.tournament.players.push(new TournamentPlayer(newValue, round, newPosition));
        this.updateTournament();
      }
    }
  }

  pollTournament() {
    if (!this.stopPolling) {
      setTimeout(() => {
        this._tournamentService.getTournamentById(this.tournament.id)
          .subscribe(
            tournament => {
              this.tournament = tournament;
              this.pollTournament();
            },
            error => {
              this.showError(error);
            });
      }, 3000);
    }
  }

  updateTournament() {
    this._tournamentService.updateTournament(this.tournament)
      .subscribe(
        tournament => {
          if (tournament) {
            this.initialize(tournament.id);
          }
        },
        error => {
          this.showError(error);
        });
  }

  deleteTournament() {
    this._tournamentService.deleteTournament(this.tournament.id)
      .subscribe(
        tournament => {
          if (!tournament) {
            this._nav.push(TournamentListComponent);
          }
        },
        error => {
          this.showError(error);
        });
  }

  viewMatch(id: number) {
    console.log('test');
    this._nav.push(MatchDetailComponent, { 'id': id } );
  }

  initialize(tournamentId: number) {
    this._tournamentService.getTournamentById(tournamentId)
      .subscribe(
        tournament => {
          this.tournament = tournament;
          if (this.userTournaments) {
            for (let i = 0; i < this.userTournaments.length; i++) {
              if (this.userTournaments[i].id === tournament.id) {
                this.hasAuthority = true;
              }
            }
          }
          this.createBracket();
        },
        error => {
          this.showError(error);
        });
  }

  getMarginTop(round: number, match: number, player: string) {
    let marginTop = '0px';
    if ((!this.tournament.scheduled && round === 1) || (this.tournament.scheduled && player)) {
      marginTop = '-38px';
    } else if ((this.getMatch(this.getPlayer(round - 1, match * 2, 1), this.getPlayer(round - 1, match * 2, 3),
      this.getPlayer(round - 1, match * 2, 2), this.getPlayer(round - 1, match * 2, 0))
      && !this.getMatch(this.getPlayer(round - 1, match * 2, 1), this.getPlayer(round - 1, match * 2, 3),
        this.getPlayer(round - 1, match * 2, 2), this.getPlayer(round - 1, match * 2, 0)).matchFinished)
      || (!this.getMatch(this.getPlayer(round - 1, match * 2, 1), this.getPlayer(round - 1, match * 2, 3),
        this.getPlayer(round - 1, match * 2, 2), this.getPlayer(round - 1, match * 2, 0))
        && this.getPlayer(round - 1, match * 2, 1) && this.getPlayer(round - 1, match * 2, 2)
        && this.getPlayer(round - 1, match * 2, 3) && this.getPlayer(round - 1, match * 2, 0)
        && this.hasAuthority) && this.tournament.scheduled) {
      marginTop = '-20px';
    }
    const styles = {
      'margin-top': marginTop
    };
    return styles;
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
