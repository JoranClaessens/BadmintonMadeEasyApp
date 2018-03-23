export class CompetitionPlayer {
    id: number;
    name: string;
    matchNumber: number;
    team: string;
    position: number;

    constructor(name: string, matchNumber: number, team: string, position: number) {
        this.name = name;
        this.matchNumber = matchNumber;
        this.team = team;
        this.position = position;
    }
}
