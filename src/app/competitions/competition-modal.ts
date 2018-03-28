import { BadmintonMatch } from "../matches/badminton-match";
import { CompetitionPlayer } from "./competition-player";
import { Competition } from "./competition";

export class CompetitionModal {
    competition: Competition;
    match: BadmintonMatch;
    matchDescription: string;
    matchType: string;
    player1: CompetitionPlayer;
    player2: CompetitionPlayer;
    player3: CompetitionPlayer;
    player4: CompetitionPlayer;

    constructor(competition: Competition, match: BadmintonMatch, matchDescription: string, matchType: string, player1: CompetitionPlayer, player2: CompetitionPlayer, player3: CompetitionPlayer, player4: CompetitionPlayer) {
        this.competition = competition;
        this.match = match;;
        this.matchDescription = matchDescription;
        this.matchType = matchType;
        this.player1 = player1;
        this.player2 = player2;
        this.player3 = player3;
        this.player4 = player4;
    }
}