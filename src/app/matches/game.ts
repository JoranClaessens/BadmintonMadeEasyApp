import { GamePK } from './gamePk';

export class Game {
    gamePk: GamePK;
    pointsTeam1: number;
    pointsTeam2: number;

    constructor(gamePk: GamePK, pointsTeam1: number, pointsTeam2: number) {
        this.gamePk = gamePk;
        this.pointsTeam1 = pointsTeam1;
        this.pointsTeam2 = pointsTeam2;
    }
}
