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
import { CompetitionModal } from '../competition-modal';

@Component({
  selector: 'bme-competition-detail',
  templateUrl: './competition-detail.component.html'
})
export class CompetitionDetailComponent implements OnInit {
  hasAuthority = false;
  stopPolling = false;
  competition: Competition;
  userCompetitions: Competition[];

  constructor(private _userService: UserService, private _competitionService: CompetitionService,
    public _nav: Nav, private _navParams: NavParams, private _toastCtrl: ToastController) { }

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

  openCompetitionDetailModal(matchNumber: number, matchDescription: string, matchType: string) {
    let competitionModal: CompetitionModal;
    let match: BadmintonMatch;

    if ((matchType === 'MEN_SINGLE' || matchType === 'WOMEN_SINGLE') && this.getPlayer(this.competition.team1, matchNumber, 1) && this.getPlayer(this.competition.team2, matchNumber, 1)) {
      match = this.getMatch(this.getPlayer(this.competition.team1, matchNumber, 1), null,
        this.getPlayer(this.competition.team2, matchNumber, 1), null, 'SINGLE');

      competitionModal = new CompetitionModal(this.competition, match, matchDescription, matchType, this.getPlayer(this.competition.team1, matchNumber, 1), this.getPlayer(this.competition.team2, matchNumber, 1), null, null);
      this._nav.push(CompetitionDetailModal, { 'modal': competitionModal });
    } else if (matchType !== 'MEN_SINGLE' && matchType !== 'WOMEN_SINGLE' && this.getPlayer(this.competition.team1, matchNumber, 1) && this.getPlayer(this.competition.team2, matchNumber, 1) &&
      this.getPlayer(this.competition.team1, matchNumber, 2) && this.getPlayer(this.competition.team2, matchNumber, 2)) {
      match = this.getMatch(this.getPlayer(this.competition.team1, matchNumber, 1), this.getPlayer(this.competition.team1, matchNumber, 2),
        this.getPlayer(this.competition.team2, matchNumber, 1), this.getPlayer(this.competition.team2, matchNumber, 2), 'DOUBLE');

      competitionModal = new CompetitionModal(this.competition, match, matchDescription, matchType, this.getPlayer(this.competition.team1, matchNumber, 1),
        this.getPlayer(this.competition.team2, matchNumber, 1), this.getPlayer(this.competition.team1, matchNumber, 2),
        this.getPlayer(this.competition.team2, matchNumber, 2));
      this._nav.push(CompetitionDetailModal, { 'modal': competitionModal });
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
}

@Component({
  templateUrl: './competition-detail-modal.html'
})
export class CompetitionDetailModal {
  modal: CompetitionModal;
  canStart = false;
  canView = false;
  canDelete = false;

  constructor(private _nav: Nav, public _navParams: NavParams,
    private _userService: UserService, private _competitionService: CompetitionService, private _matchService: MatchService,
    private _toastCtrl: ToastController) {
    this.modal = this._navParams.get('modal');
    this.convertToMinutes();
    this.checkAuthority();
  }

  convertToMinutes() {
    if (this.modal.match && this.modal.match.matchCreated) {
      const eventStartTime = new Date(this.modal.match.matchCreated);
      const dateNow = new Date();
      let duration = dateNow.valueOf() - eventStartTime.valueOf();
      duration = Math.floor(duration / (1000 * 60) % 60);
      if (duration !== 0) {
        (<any>this.modal.match).duration = duration;
      } else {
        (<any>this.modal.match).duration = '0';
      }
    }
  }

  startMatch() {
    if (this.modal.matchType === 'MEN_SINGLE' || this.modal.matchType === 'WOMEN_SINGLE') {
      this.modal.player3 = new CompetitionPlayer(null, null, null, null);
      this.modal.player4 = new CompetitionPlayer(null, null, null, null);
    }

    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._competitionService.createMatch(new BadmintonMatch(this.modal.competition.title, this.modal.matchType,
            this.modal.player1.name, this.modal.player2.name, this.modal.player3.name, this.modal.player4.name, this.modal.competition.street, this.modal.competition.city, null),
            +prop[0], this.modal.competition.id)
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

  viewMatch() {
    this._nav.push(MatchDetailComponent, { 'id': this.modal.match.id });
  }

  deleteMatch() {
    this._matchService.deleteMatch(this.modal.match.id)
      .subscribe(
        badmintonMatch => {
          if (!badmintonMatch) {
            this._nav.push(CompetitionDetailComponent, { 'id': this.modal.competition.id });
          }
        },
        error => {
          this.showError(error);
        });
  }

  checkAuthority() {
    if (this.modal.match) {
      this.canView = true;
    }
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          if (this.modal.match) {
            this.canDelete = true;
          } else {
            if ((this.modal.matchType === 'MEN_SINGLE' || this.modal.matchType === 'WOMEN_SINGLE') &&
              this.modal.player1 && this.modal.player2) {
              this.canStart = true;
            } else if (this.modal.matchType !== 'MEN_SINGLE' && this.modal.matchType !== 'WOMEN_SINGLE' &&
              this.modal.player1 && this.modal.player2 && this.modal.player3 && this.modal.player4) {
              this.canStart = true;
            }
          }
        }
      });
  }

  dismiss() {
    this._nav.push(CompetitionDetailComponent, { 'id': this.modal.competition.id });
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
