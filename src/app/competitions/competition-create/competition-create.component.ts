import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../competition.service';
import { Competition } from '../competition';
import { UserService } from '../../account/user.service';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'bme-competition-create',
  templateUrl: './competition-create.component.html'
})
export class CompetitionCreateComponent implements OnInit {
  competitionId: number;
  title: string;
  team1: string;
  team2: string;
  selectedCompetitionType = 'NONE';
  startDate: Date;
  street: string;
  city: string;
  createLocation = false;

  constructor(private _competitionService: CompetitionService, private _userService: UserService, private _toastCtrl: ToastController) { }

  ngOnInit() {
  }

  createCompetition() {
    if (this.isValid()) {
      this._userService.getUser()
        .then(prop => {
          if (prop[0] && prop[1]) {
            this._competitionService.createCompetition(new Competition(this.title, this.selectedCompetitionType, this.team1, this.team2,
              this.startDate, this.street, this.city), +prop[0])
              .subscribe(
                competition => {
                  if (competition) {
                    this.showSuccess('Competitiepartij succesvol aangemaakt!');
                    this.clearForm();
                  }
                },
                error => {
                  this.showError(error);
                });
          }
        });
    } else {
      this.showError('Gelieve alle verplichte velden in te vullen!');
    }
  }

  isValid(): boolean {
    if (this.title && this.selectedCompetitionType !== 'NONE' && this.team1 && this.team2 && this.startDate) {
      return true;
    }
    return false;
  }

  showError(message: string) {
    let toast = this._toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-danger"
    });
    toast.present(toast);
  }

  showSuccess(message: string) {
    let toast = this._toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });
    toast.present(toast);
  }

  clearForm() {
    this.title = null;
    this.selectedCompetitionType = 'NONE';
    this.team1 = null;
    this.team2 = null;
    this.startDate = null;
    this.street = null;
    this.city = null;
    this.createLocation = false;
  }

}
