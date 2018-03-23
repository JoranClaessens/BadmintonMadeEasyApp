import { User } from '../account/user';
import { BadmintonMatch } from '../matches/badminton-match';
import { CompetitionPlayer } from './competition-player';

export class Competition {
    id: number;
    title: string;
    type: string;
    team1: string;
    team2: string;
    startDate: Date;
    matches: BadmintonMatch[];
    players: CompetitionPlayer[];
    user: User;
    street: string;
    city: string;

    constructor(title: string, type: string, team1: string, team2: string, startDate: Date, street: string, city: string) {
        this.title = title;
        this.type = type;
        this.team1 = team1;
        this.team2 = team2;
        this.startDate = startDate;
        this.street = street;
        this.city = city;
    }
}
