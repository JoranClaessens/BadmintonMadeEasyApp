import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../account/user.service';
import { TournamentService } from '../tournament.service';
import { Tournament } from '../tournament';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'bme-tournament-create',
  templateUrl: './tournament-create.component.html'
})
export class TournamentCreateComponent implements OnInit {
  today = new Date();
  title: string;
  selectedMatchType = 'NONE';
  startDate: Date;
  endDate: Date;
  numberOfTeams: number;
  street: string;
  city: string;
  createLocation = false;

  constructor(private _tournamentService: TournamentService, private _userService: UserService, private _toastCtrl: ToastController) { }

  ngOnInit() {
  }

  createTournament() {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._tournamentService.createTournament(new Tournament(this.title, this.numberOfTeams, this.selectedMatchType,
            new Date(this.startDate), new Date(this.endDate), this.street, this.city), +prop[0])
            .subscribe(
              tournament => {
                if (tournament) {
                  this.showSuccess('Toernooi succesvol aangemaakt!');
                  this.clearForm();
                }
              },
              error => {
                this.showError(error);
              });
        }
      });
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

  showSuccess(message: string) {
    let toast = this._toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: "toast-success"
    });
    toast.present(toast);
  }

  clearForm() {
    this.title = null;
    this.selectedMatchType = 'NONE';
    this.numberOfTeams = null;
    this.startDate = null;
    this.endDate = null;
    this.street = null;
    this.city = null;
    this.createLocation = false;
  }
}
