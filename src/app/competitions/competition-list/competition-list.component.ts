import { Component, OnInit } from '@angular/core';
import { Competition } from '../competition';
import { UserService } from '../../account/user.service';
import { CompetitionService } from '../competition.service';
import { Nav, ToastController } from 'ionic-angular';
import { CompetitionCreateComponent } from '../competition-create/competition-create.component';
import { CompetitionDetailComponent } from '../competition-detail/competition-detail.component';

@Component({
  selector: 'bme-competition-list',
  templateUrl: './competition-list.component.html'
})
export class CompetitionListComponent implements OnInit {
  loggedIn = false;
  showFilter = false;
  keyBox = true;
  teamBox = true;
  titleBox = true;
  filterQuery: string;
  selectedCompetitionTab: number;
  userCompetitionsCount = 0;
  competitions: Competition[];

  constructor(private _userService: UserService, private _competitionService: CompetitionService, private _nav: Nav, private _toastCtrl: ToastController) { }

  ngOnInit() {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this.loggedIn = true;
          this.loadAllCompetitions(+prop[0]);
        } else {
          this.loadAllCompetitions(null);
        }
      });
  }

  loadAllCompetitions(userId: number) {
    this.selectedCompetitionTab = 1;
    if (userId) {
      this._competitionService.getCompetitionsByUser(userId)
        .subscribe(
          competitions => {
            this.userCompetitionsCount = competitions.length;
            this.loadAllCompetitions(null);
          },
          error => {
            this.loadAllCompetitions(null);
            this.showError(error);
          });
    } else {
      this._competitionService.getCompetitions()
        .subscribe(
          competitions => {
            this.competitions = competitions;
            this.resetFilter();
          },
          error => {
            this.showError(error);
          });
    }

  }

  loadUserCompetitions() {
    this.selectedCompetitionTab = 2;
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._competitionService.getCompetitionsByUser(+prop[0])
            .subscribe(
              competitions => {
                this.competitions = competitions;
                this.userCompetitionsCount = this.competitions.length;
                this.resetFilter();
              },
              error => {
                this.showError(error);
              });
        } else {
          this.competitions = null;
        }
      });
  }

  filter() {
    if (this.selectedCompetitionTab === 1) {
      this._competitionService.getCompetitions()
        .subscribe(
          competitions => {
            this.competitions = competitions;
            this.filterInput();
          },
          error => {
            this.showError(error);
          });
    } else {
      this._userService.getUser()
        .then(prop => {
          if (prop[0] && prop[1]) {
            this._competitionService.getCompetitionsByUser(+prop[0])
              .subscribe(
                competitions => {
                  this.competitions = competitions;
                  this.filterInput();
                },
                error => {
                  this.showError(error);
                });
          } else {
            this.competitions = null;
            this.filterInput();
          }
        });
    }
  }

  filterInput() {
    const filterCompetitions = new Array<Competition>();

    if (this.keyBox) {
      for (let i = 0; i < this.competitions.length; i++) {
        if (this.competitions[i].id === +this.filterQuery) {
          if (filterCompetitions.indexOf(this.competitions[i]) === -1) {
            filterCompetitions.push(this.competitions[i]);
          }
        }
      }
    }

    if (this.teamBox) {
      for (let i = 0; i < this.competitions.length; i++) {
        if (this.competitions[i].team1.toLowerCase().includes(this.filterQuery.toLowerCase())
            || this.competitions[i].team2.toLowerCase().includes(this.filterQuery.toLowerCase())) {
          if (filterCompetitions.indexOf(this.competitions[i]) === -1) {
            filterCompetitions.push(this.competitions[i]);
          }
        }
      }
    }

    if (this.titleBox) {
      for (let i = 0; i < this.competitions.length; i++) {
        if (this.competitions[i].title.toLowerCase().includes(this.filterQuery.toLowerCase())) {
          if (filterCompetitions.indexOf(this.competitions[i]) === -1) {
            filterCompetitions.push(this.competitions[i]);
          }
        }
      }
    }
    this.competitions = filterCompetitions;
  }

  resetFilter() {
    this.filterQuery = '';
    this.keyBox = true;
    this.teamBox = true;
    this.titleBox = true;
    this.filter();
  }

  createCompetition() {
    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._nav.push(CompetitionCreateComponent);
        } else {
          this.showWarning('U moet zich eerst aanmelden of registreren voordat u een competitiepartij kan aanmaken!');
        }
      });
  }

  competitionDetail(id: number) {
    this._nav.push(CompetitionDetailComponent, { 'id': id });
  }

  getFontWeight(points1: number, points2: number): string {
    if (points1 > points2) {
      return 'bold';
    }
    return null;
  }

  swipeEvent(e) {
    if (e.direction === 4 && this.selectedCompetitionTab === 2) {
      this.loadAllCompetitions(null);
    } else if (e.direction === 2 && this.selectedCompetitionTab === 1) {
      this.loadUserCompetitions();
    }
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

  showWarning(message: string) {
    let toast = this._toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-warning"
    });
    toast.present(toast);
  }
}
