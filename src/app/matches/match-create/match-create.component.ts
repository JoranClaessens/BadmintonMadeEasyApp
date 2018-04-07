import { Component, OnInit } from '@angular/core';
import { BadmintonMatch } from '../badminton-match';
import { MatchService } from '../match.service';
import { UserService } from '../../account/user.service';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'bme-match-create',
  templateUrl: './match-create.component.html'
})
export class MatchCreateComponent implements OnInit {
  match: BadmintonMatch;
  matchTitle: string;
  selectedMatchType = 'NONE';
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  street: string;
  postalCode: string;
  city: string;
  terrainNumber: string;
  createLocation = false;

  constructor(private _matchService: MatchService, private _userService: UserService, private _toastCtrl: ToastController) { }

  ngOnInit() {
  }

  createMatch() {
    if (this.isValid()) {
      this._userService.getUser()
        .then(prop => {
          if (prop[0] && prop[1]) {
            this._matchService.createMatch(new BadmintonMatch(this.matchTitle, this.selectedMatchType,
              this.player1, this.player2, this.player3, this.player4, this.street, this.city, this.terrainNumber),
              +prop[0])
              .subscribe(
                badmintonMatch => {
                  if (badmintonMatch) {
                    this.showSuccess('Wedstrijd succesvol aangemaakt!');
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
    if (this.matchTitle && this.player1 && this.player2
      && ((this.selectedMatchType === 'MEN_SINGLE' || this.selectedMatchType === 'WOMEN_SINGLE')
        || (this.selectedMatchType !== 'MEN_SINGLE' && this.selectedMatchType !== 'WOMEN_SINGLE' && this.player3 && this.player4))) {
      return true;
    }
    return false;
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
    this.matchTitle = null;
    this.selectedMatchType = 'NONE';
    this.player1 = null;
    this.player2 = null;
    this.player3 = null;
    this.player4 = null;
    this.street = null;
    this.city = null;
    this.terrainNumber = null;
    this.createLocation = false;
  }
}
