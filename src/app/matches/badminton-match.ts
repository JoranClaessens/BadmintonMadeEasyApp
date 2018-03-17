import { Game } from './game';
import { User } from '../account/user';

export class BadmintonMatch {
    id: number;
    title: string;
    type: string;
    player1: string;
    player2: string;
    player3: string;
    player4: string;
    player1Left: boolean;
    player2Left: boolean;
    serviceTeam1: boolean;
    matchCreated: Date;
    matchFinished: Date;
    games: Game[];
    user: User;
    street: string;
    city: string;
    terrainNumber: string;

    constructor(title: string, type: string, player1: string, player2: string, player3: string, player4: string,
            street: string, city: string, terrainNumber: string) {
        this.title = title;
        this.type = type;
        this.player1 = player1;
        this.player2 = player2;
        this.player3 = player3;
        this.player4 = player4;
        this.serviceTeam1 = true;
        this.player1Left = false;
        this.player2Left = false;
        this.street = street;
        this.city = city;
        this.terrainNumber = terrainNumber;
    }
}
