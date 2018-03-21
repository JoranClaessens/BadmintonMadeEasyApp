import { User } from '../account/user';
import { TournamentPlayer } from './tournament-player';
import { BadmintonMatch } from '../matches/badminton-match';

export class Tournament {
    id: number;
    title: string;
    numberOfTeams: number;
    type: string;
    startDate: Date;
    endDate: Date;
    matches: BadmintonMatch[];
    players: TournamentPlayer[];
    user: User;
    street: string;
    city: string;
    scheduled: boolean;

    constructor(title: string, numberOfTeams: number, type: string, startDate: Date, endDate: Date, street: string, city: string) {
        this.title = title;
        this.numberOfTeams = numberOfTeams;
        this.type = type;
        this.startDate = startDate;
        this.endDate = endDate;
        this.street = street;
        this.city = city;
        this.scheduled = false;
    }
}
