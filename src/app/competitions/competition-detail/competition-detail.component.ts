import { Component, OnInit } from '@angular/core';
import { Competition } from '../competition';
import { UserService } from '../../account/user.service';
import { CompetitionService } from '../competition.service';
import { CompetitionPlayer } from '../competition-player';
import { BadmintonMatch } from '../../matches/badminton-match';
import { MatchService } from '../../matches/match.service';
import { Nav, NavParams, ToastController } from 'ionic-angular';
import { CompetitionListComponent } from '../competition-list/competition-list.component';
import { MatchDetailComponent } from '../../matches/match-detail/match-detail.component';

@Component({
  selector: 'bme-competition-detail',
  templateUrl: './competition-detail.component.html'
})
export class CompetitionDetailComponent implements OnInit {
  hasAuthority = false;
  stopPolling = false;
  competition: Competition;
  userCompetitions: Competition[];

  constructor(private _userService: UserService, private _competitionService: CompetitionService, private _matchService: MatchService,
    private _nav: Nav, private _navParams: NavParams, private _toastCtrl: ToastController) { }

  ngOnInit() {
    const id = +this._navParams.get('id');

    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._competitionService.getCompetitionsByUser(+prop[0])
            .subscribe(
              competitions => {
                this.userCompetitions = competitions;
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
    this.pollCompetition();
  }

  ionViewDidLeave() {
    this.stopPolling = true;
  }

  getPlayer(team: string, match: number, position: number): CompetitionPlayer {
    for (let i = 0; i < this.competition.players.length; i++) {
      if (this.competition.players[i].team === team && this.competition.players[i].matchNumber === match &&
        this.competition.players[i].position === position) {
        return this.competition.players[i];
      }
    }
  }

  getMatch(player1team1: CompetitionPlayer, player2team1: CompetitionPlayer,
    player1team2: CompetitionPlayer, player2team2: CompetitionPlayer, type: string): BadmintonMatch {
    if (type === 'SINGLE') {
      if (player1team1 && player1team2) {
        for (let i = 0; i < this.competition.matches.length; i++) {
          if (this.competition.matches[i].player1 === player1team1.name &&
            this.competition.matches[i].player2 === player1team2.name &&
            !this.competition.matches[i].player3 && !this.competition.matches[i].player4) {
            return this.competition.matches[i];
          }
        }
      }
    } else {
      if (player1team1 && player1team2 && player2team1 && player2team2) {
        for (let i = 0; i < this.competition.matches.length; i++) {
          if (this.competition.matches[i].player1 === player1team1.name &&
            this.competition.matches[i].player2 === player1team2.name &&
            this.competition.matches[i].player3 === player2team1.name &&
            this.competition.matches[i].player4 === player2team2.name) {
            return this.competition.matches[i];
          }
        }
      }
    }
    return null;
  }

  startMatch(player1team1: CompetitionPlayer, player2team1: CompetitionPlayer,
    player1team2: CompetitionPlayer, player2team2: CompetitionPlayer, type: string) {
    if (!player2team1 && !player2team2) {
      player2team1 = new CompetitionPlayer(null, null, null, null);
      player2team2 = new CompetitionPlayer(null, null, null, null);
    }
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._competitionService.createMatch(new BadmintonMatch(this.competition.title, type,
            player1team1.name, player1team2.name, player2team1.name, player2team2.name, this.competition.street, this.competition.city, null),
            +prop[0], this.competition.id)
            .subscribe(
              badmintonMatch => {
                if (badmintonMatch) {
                  this._nav.push(MatchDetailComponent, { 'id': badmintonMatch.id });
                }
              },
              error => {
                this.showError(error);
              });
        }
      });
  }

  viewMatch(match: BadmintonMatch) {
    this._nav.push(MatchDetailComponent, { 'id': match.id });
  }

  deleteMatch(match: BadmintonMatch) {
    this._matchService.deleteMatch(match.id)
      .subscribe(
        badmintonMatch => {
          if (!badmintonMatch) {
            this.initialize(this.competition.id);
          }
        },
        error => {
          this.showError(error);
        });
  }

  updateCompetition() {
    this._competitionService.updateCompetition(this.competition)
      .subscribe(
        competition => {
          if (competition) {
            this.initialize(competition.id);
          }
        },
        error => {
          this.showError(error);
        });
  }

  updateCompetitionPlayer(newValue: string, team: string, match: number, position: number) {
    const player = this.getPlayer(team, match, position);
    if (player) {
      for (let i = 0; i < this.competition.players.length; i++) {
        if (this.competition.players[i].id === player.id) {
          if (newValue && newValue !== '') {
            this.competition.players[i].name = newValue;
            this.updateCompetition();
          } else {
            this._competitionService.deleteCompetitionPlayer(this.competition.players[i])
              .subscribe(
                competitionPlayer => {
                  if (!competitionPlayer) {
                    this.competition.players.splice(i, 1);
                    this.updateCompetition();
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
        this.competition.players.push(new CompetitionPlayer(newValue, match, team, position));
        this.updateCompetition();
      }
    }
  }

  deleteCompetition() {
    this._competitionService.deleteCompetition(this.competition.id)
      .subscribe(
        competition => {
          if (!competition) {
            this._nav.push(CompetitionListComponent);
          }
        },
        error => {
          this.showError(error);
        });
  }

  checkMatchWins() {
    let matchesWonTeam1 = 0;
    let matchesWonTeam2 = 0;
    for (let j = 0; j < this.competition.matches.length; j++) {
      if (this.competition.matches[j].matchFinished) {
        let gamesWonTeam1 = 0;
        let gamesWonTeam2 = 0;
        for (let x = 0; x < this.competition.matches[j].games.length; x++) {
          if (this.competition.matches[j].games[x].pointsTeam1 > this.competition.matches[j].games[x].pointsTeam2) {
            gamesWonTeam1++;
          } else {
            gamesWonTeam2++;
          }
        }

        if (gamesWonTeam1 > gamesWonTeam2) {
          matchesWonTeam1++;
        } else {
          matchesWonTeam2++;
        }
      }
    }
    (<any>this.competition).matchesWonTeam1 = matchesWonTeam1;
    (<any>this.competition).matchesWonTeam2 = matchesWonTeam2;
  }

  pollCompetition() {
    if (!this.stopPolling) {
      setTimeout(() => {
        this._competitionService.getCompetitionById(this.competition.id)
          .subscribe(
            competition => {
              this.competition = competition;
              this.checkMatchWins();
              this.pollCompetition();
            },
            error => {
              this.showError(error);
            });
      }, 3000);
    }
  }

  initialize(competitionId: number) {
    this._competitionService.getCompetitionById(competitionId)
      .subscribe(
        competition => {
          this.competition = competition;
          if (this.userCompetitions) {
            for (let i = 0; i < this.userCompetitions.length; i++) {
              if (this.userCompetitions[i].id === competition.id) {
                this.hasAuthority = true;
              }
            }
          }
          this.checkMatchWins();
        },
        error => {
          this.showError(error);
        });
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
