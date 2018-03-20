import { Injectable } from '@angular/core';
import { BadmintonMatch } from './badminton-match';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Game } from './game';
import { Http } from '@angular/http';

@Injectable()
export class MatchService {
    private matchUrl = 'http://192.168.0.184:8080/api/matches';

    constructor(private _http: Http) { }

    getMatches(): Observable<BadmintonMatch[]> {
        return this._http.get(this.matchUrl)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    getGameByGamePK(matchId: number, gameId: number): Observable<Game> {
        return this._http.get(this.matchUrl + '/game/' + matchId + '/' + gameId)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    getMatchesByUser(userId: number): Observable<BadmintonMatch[]> {
        return this._http.get(this.matchUrl + '/user/' + userId)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    getMatchById(id: number): Observable<BadmintonMatch> {
        return this._http.get(this.matchUrl + '/' + id)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    getMatchByPlayerNames(player1: string, player2: string, tournamentId: number): Observable<BadmintonMatch> {
        return this._http.get(this.matchUrl + '/' + player1 + '/' + player2 + '/' + tournamentId)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    createMatch(badmintonMatch: BadmintonMatch, userId: number): Observable<BadmintonMatch> {
        return this._http.post(this.matchUrl + '/create/' + userId, badmintonMatch)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    createGame(game: Game): Observable<Game> {
        return this._http.post(this.matchUrl + '/games/create', game)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    updateMatch(badmintonMatch: BadmintonMatch): Observable<BadmintonMatch> {
        return this._http.put(this.matchUrl, badmintonMatch)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    updateGame(game: Game): Observable<Game> {
        return this._http.put(this.matchUrl + '/game', game)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    deleteMatch(matchId: number): Observable<BadmintonMatch> {
        return this._http.delete(this.matchUrl + '/' + matchId)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }
}
