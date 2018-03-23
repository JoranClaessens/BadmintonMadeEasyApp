import { Component, OnInit } from '@angular/core';
import { Tournament } from '../tournament';
import { UserService } from '../../account/user.service';
import { TournamentService } from '../tournament.service';
import { Nav, ToastController } from 'ionic-angular';
import { TournamentCreateComponent } from '../tournament-create/tournament-create.component';
import { TournamentDetailComponent } from '../tournament-detail/tournament-detail.component';

@Component({
  selector: 'bme-tournament-list',
  templateUrl: './tournament-list.component.html'
})
export class TournamentListComponent implements OnInit {
  loggedIn = false;
  selectedTournamentTab: number;
  userTournamentsCount = 0;
  tournaments: Tournament[];
  customWarningMessage: string;

  constructor(private _userService: UserService, private _tournamentService: TournamentService, private _nav: Nav, private _toastCtrl: ToastController) { }

  ngOnInit() {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this.loggedIn = true;
          this.loadAllTournaments(+prop[0]);
        } else {
          this.loadAllTournaments(null);
        }
      });
  }

  loadAllTournaments(userId: number) {
    this.selectedTournamentTab = 1;
    if (userId) {
      this._tournamentService.getTournamentsByUser(userId)
        .subscribe(
          tournaments => {
            this.userTournamentsCount = tournaments.length;
            this.loadAllTournaments(null);
          },
          error => {
            this.loadAllTournaments(null);
            this.showError(error);
          });
    } else {
      this._tournamentService.getTournaments()
        .subscribe(
          tournaments => {
            this.tournaments = tournaments;
          },
          error => {
            this.showError(error);
          });
    }
  }

  loadUserTournaments() {
    this.selectedTournamentTab = 2;
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._tournamentService.getTournamentsByUser(+prop[0])
            .subscribe(
              tournaments => {
                this.tournaments = tournaments;
                this.userTournamentsCount = this.tournaments.length;
              },
              error => {
                this.showError(error);
              });
        } else {
          this.tournaments = null;
        }
      });
  }

  createTournament() {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._nav.push(TournamentCreateComponent);
        } else {
          this.showWarning('U moet zich eerst aanmelden of registreren voordat u een toernooi kan aanmaken!');
        }
      });
  }

  tournamentDetail(id: number) {
    this._nav.push(TournamentDetailComponent, { 'id': id} );
  }

  swipeEvent(e) {
    if (e.direction === 4 && this.selectedTournamentTab === 2) {
      this.loadAllTournaments(null);
    } else if (e.direction === 2 && this.selectedTournamentTab === 1) {
      this.loadUserTournaments();
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
