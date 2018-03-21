export class TournamentPlayer {
    id: number;
    name: string;
    round: number;
    position: number;

    constructor(name: string, round: number, position: number) {
        this.name = name;
        this.round = round;
        this.position = position;
    }
}
