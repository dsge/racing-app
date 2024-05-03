import { Driver } from './driver.model';
import { Race, UserProfile } from './race.model';
import { UserVote, UserVoteRecord } from './user-vote.model';

/**
 * Data structure for the "Final Results" table
 */
export interface FinalRaceResultsTableContents {
  race: Race;
  /**
   * non-fastest lap results
   */
  normalRaceFinalResults: UserVote[] | undefined;
  fastestLap: UserVote[] | undefined;
}

export interface VoteTableColumn {
  title: string;
  driver_position_to_display?: number;
  is_fastest_lap_column?: boolean;
}

export interface VoteData {
  vote: UserVoteRecord;
  driver: Driver | undefined;
  correct: boolean;
  incorrect: boolean;
  unknown: boolean;
}

export interface VoteTableRow {
  user?: UserProfile;
  votes: (VoteData | null)[];
  finalPoints: number;
  highestPoints?: boolean;
}

/**
 * Data structure for the "User Votes" table
 */
export interface UserVotesTableContents {
  race: Race;
  tableColumns: VoteTableColumn[];
  tableRows: VoteTableRow[];
}
