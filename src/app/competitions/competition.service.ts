import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Competition } from './competition';
import { CompetitionPlayer } from './competition-player';
import { BadmintonMatch } from '../matches/badminton-match';
import { Http } from '@angular/http';

@Injectable()
export class CompetitionService {
    private competitionUrl = 'http://192.168.0.184:8080/api/competitions';

    constructor(private _http: Http) { }

    getCompetitions(): Observable<Competition[]> {
        return this._http.get(this.competitionUrl)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    getCompetitionById(id: number): Observable<Competition> {
        return this._http.get(this.competitionUrl + '/' + id)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    getCompetitionsByUser(userId: number): Observable<Competition[]> {
        return this._http.get(this.competitionUrl + '/user/' + userId)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    createCompetition(competition: Competition, userId: number): Observable<Competition> {
        return this._http.post(this.competitionUrl + '/create/' + userId, competition)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    createMatch(badmintonMatch: BadmintonMatch, userId: number, competitionId: number): Observable<BadmintonMatch> {
        return this._http.post(this.competitionUrl + '/matches/' + userId + '/' + competitionId, badmintonMatch)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    updateCompetition(competition: Competition): Observable<Competition> {
        return this._http.put(this.competitionUrl, competition)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    deleteCompetition(competitionId: number): Observable<Competition> {
        return this._http.delete(this.competitionUrl + '/' + competitionId)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    deleteCompetitionPlayer(competitionPlayer: CompetitionPlayer): Observable<CompetitionPlayer> {
        return this._http.delete(this.competitionUrl + '/players/' + competitionPlayer.id)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }
}
