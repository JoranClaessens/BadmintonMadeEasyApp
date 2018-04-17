import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Tournament } from './tournament';
import { Observable } from 'rxjs/Observable';
import { TournamentPlayer } from './tournament-player';
import { BadmintonMatch } from '../matches/badminton-match';

@Injectable()
export class TournamentService {
    private tournamentUrl = 'http://localhost:8080/api/tournaments';

    constructor(private _http: Http) { }

    getTournaments(): Observable<Tournament[]> {
        return this._http.get(this.tournamentUrl)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    getTournamentById(id: number): Observable<Tournament> {
        return this._http.get(this.tournamentUrl + '/' + id)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    getTournamentsByUser(userId: number): Observable<Tournament[]> {
        return this._http.get(this.tournamentUrl + '/user/' + userId)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    createTournament(tournament: Tournament, userId: number): Observable<Tournament> {
        return this._http.post(this.tournamentUrl + '/create/' + userId, tournament)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    createMatch(badmintonMatch: BadmintonMatch, userId: number, tournamentId: number): Observable<BadmintonMatch> {
        return this._http.post(this.tournamentUrl + '/matches/' + userId + '/' + tournamentId, badmintonMatch)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    updateTournament(tournament: Tournament): Observable<Tournament> {
        return this._http.put(this.tournamentUrl, tournament)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    deleteTournament(tournamentId: number): Observable<Tournament> {
        return this._http.delete(this.tournamentUrl + '/' + tournamentId)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    deleteTournamentPlayer(tournamentPlayer: TournamentPlayer): Observable<TournamentPlayer> {
        return this._http.delete(this.tournamentUrl + '/players/' + tournamentPlayer.id)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }
}
