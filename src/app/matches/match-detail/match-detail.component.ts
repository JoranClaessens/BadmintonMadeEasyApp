import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatchService } from '../match.service';
import { BadmintonMatch } from '../badminton-match';
import { HttpErrorResponse } from '@angular/common/http';
import { Game } from '../game';
import { UserService } from '../../account/user.service';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { NavParams, Nav } from 'ionic-angular';
import { MatchListComponent } from '../match-list/match-list.component';

@Component({
  selector: 'bme-match-detail',
  templateUrl: './match-detail.component.html'
})
export class MatchDetailComponent implements OnInit, OnDestroy {
  courtImage = 'assets/imgs/badminton-court.jpg';
  hasAuthority = false;
  stopPolling = false;
  userMatches: BadmintonMatch[];
  match: BadmintonMatch;
  currentGame: Game;
  errorMessage: HttpErrorResponse;

  constructor(private _userService: UserService, private _matchService: MatchService,
    private _navParams: NavParams, private _nav: Nav) { }

  ngOnInit() {
    const id = +this._navParams.get('id');

    this._userService.getUser()
      .then(prop => {
        if (prop[0] && prop[1]) {
          this._matchService.getMatchesByUser(+prop[0])
            .subscribe(
              badmintonMatches => {
                this.userMatches = badmintonMatches;
                this.loadMatch(id);
              },
              error => {
                this.errorMessage = <any>error;
              });
        } else {
          this.loadMatch(id);
        }
      });
    this.checkGame();
  }

  ngOnDestroy() {
    this.stopPolling = true;
  }

  loadMatch(id: number) {
    this._matchService.getMatchById(id)
      .subscribe(
        badmintonMatch => {
          this.match = badmintonMatch;
          if (this.userMatches) {
            for (let i = 0; i < this.userMatches.length; i++) {
              if (this.userMatches[i].id === badmintonMatch.id) {
                this.hasAuthority = true;
              }
            }
          }
        },
        error => {
          this.errorMessage = <any>error;
        });
  }

  simulateMatch() {
    // this._router.navigate(['/matches/simulate/' + this.match.id]);
  }

  editMatch() {
    // this._router.navigate(['/matches/edit/' + this.match.id]);
  }

  deleteMatch() {
    this._matchService.deleteMatch(this.match.id)
      .subscribe(
        badmintonmatch => {
          if (!badmintonmatch) {
            this._nav.push(MatchListComponent);
          }
        },
        error => {
          this.errorMessage = <any>error;
        });
  }

  checkGame() {
    if (!this.stopPolling) {
      setTimeout(() => {
        this._matchService.getMatchById(this.match.id)
          .subscribe(
            badmintonmatch => {
              this.match = badmintonmatch;
              this.checkGame();
            },
            error => {
              this.errorMessage = <any>error;
            });
      }, 1000);
    }
  }

  getFontWeight(points1: number, points2: number): string {
    if (points1 > points2) {
      return 'bold';
    }
    return null;
  }
}
