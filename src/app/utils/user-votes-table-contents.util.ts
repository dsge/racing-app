import { Driver } from '../models/driver.model';
import {
  Race,
  RaceScoreScreenVote,
  RaceScoreScreenVotes,
} from '../models/race.model';
import {
  UserVotesTableContents,
  VoteData,
  VoteTableColumn,
  VoteTableRow,
} from '../models/results-page.model';
import { UserVote, UserVoteRecord } from '../models/user-vote.model';

export const raceAndScooreScreenVotesToUserVotesTableContents: (
  race: Race,
  raceScoreScreenVotes: RaceScoreScreenVotes,
  drivers: Driver[]
) => UserVotesTableContents = (
  race: Race,
  raceScoreScreenVotes: RaceScoreScreenVotes,
  drivers: Driver[]
): UserVotesTableContents => {
  return {
    race: race,
    tableColumns: raceToTableColumns(race),
    tableRows: getTableRows(
      raceScoreScreenVotes,
      raceToTableColumns(race),
      drivers
    ),
  };
};

const raceToTableColumns: (race: Race) => VoteTableColumn[] = (
  race: Race
): VoteTableColumn[] => {
  if (race.is_sprint_race) {
    return calculatePositions(8).map((position: number) => ({
      title: `${position}`,
      driver_position_to_display: position,
    }));
  } else {
    const ret: VoteTableColumn[] = calculatePositions(10).map(
      (position: number) => ({
        title: `${position}`,
        driver_position_to_display: position,
      })
    );
    ret.push({
      title: 'Fastest Lap',
      is_fastest_lap_column: true,
    });
    return ret;
  }
};

/**
 * returns a list of numbers starting from 1 up to `numberOfPositions`
 */
const calculatePositions: (numberOfPositions: number) => number[] = (
  numberOfPositions: number
): number[] => {
  return Array.from(
    { length: numberOfPositions },
    (_: unknown, i: number) => i + 1
  );
};

const getTableRows: (
  raceScoreScreenVotes: RaceScoreScreenVotes,
  tableColumns: VoteTableColumn[],
  drivers: Driver[]
) => VoteTableRow[] = (
  raceScoreScreenVotes: RaceScoreScreenVotes,
  tableColumns: VoteTableColumn[],
  drivers: Driver[]
): VoteTableRow[] => {
  const ret: VoteTableRow[] = raceScoreScreenVotes.userVotes.map(
    (rowData: RaceScoreScreenVote) => {
      const votes: (VoteData | null)[] = userVotesToDisplay(
        tableColumns,
        rowData,
        raceScoreScreenVotes,
        drivers
      );
      return {
        user: rowData.user,
        votes: votes,
        finalPoints: calculateFinalPoints(votes),
      };
    }
  );
  return addHighestPoints(ret);
};

const addHighestPoints: (rows: VoteTableRow[]) => VoteTableRow[] = (
  rows: VoteTableRow[]
): VoteTableRow[] => {
  let highest: number = -1;
  let highestIndex: number = 0;
  rows.forEach((row: VoteTableRow, index: number) => {
    if (row.finalPoints > highest) {
      highest = row.finalPoints;
      highestIndex = index;
    }
  });
  if (highest >= 0) {
    rows[highestIndex].highestPoints = true;
  }
  return rows;
};

const calculateFinalPoints: (votes: (VoteData | null)[]) => number = (
  votes: (VoteData | null)[]
): number => {
  return votes.reduce((points: number, vote: VoteData | null) => {
    return points + (vote?.correct ? 1 : 0);
  }, 0);
};

const userVotesToDisplay: (
  tableColumns: VoteTableColumn[],
  rowData: RaceScoreScreenVote,
  raceScoreScreenVotes: RaceScoreScreenVotes,
  drivers: Driver[]
) => (VoteData | null)[] = (
  tableColumns: VoteTableColumn[],
  rowData: RaceScoreScreenVote,
  raceScoreScreenVotes: RaceScoreScreenVotes,
  drivers: Driver[]
): (VoteData | null)[] => {
  const finalResults: UserVote[] | undefined =
    raceScoreScreenVotes.raceFinalResults;
  const haveFinalResults: boolean = !!finalResults?.length;
  return tableColumns.map((tableColumn: VoteTableColumn) => {
    const voteRecord: UserVoteRecord | undefined = rowData.votes.find(
      (record: UserVoteRecord) => {
        if (tableColumn.is_fastest_lap_column) {
          return record.is_fastest_lap_vote === true;
        } else {
          return (
            record.driver_final_position ===
            tableColumn.driver_position_to_display
          );
        }
      }
    );
    if (!voteRecord) {
      return null;
    }
    const driver: Driver | undefined = driverIdToDriver(
      voteRecord.driver_id,
      drivers
    );
    const correct: boolean =
      haveFinalResults &&
      isCorrectVote(
        voteRecord.driver_final_position ?? -2,
        driver,
        finalResults
      );

    return {
      vote: voteRecord,
      driver: driver,
      correct: haveFinalResults && correct,
      incorrect: haveFinalResults && !correct,
      unknown: !haveFinalResults,
    };
  });
};

export const driverIdToDriver: (
  driver_id: number | undefined,
  drivers: Driver[]
) => Driver | undefined = (
  driver_id: number | undefined,
  drivers: Driver[]
): Driver | undefined => {
  return drivers.find((driver: Driver) => driver.id === driver_id);
};

const isCorrectVote: (
  position: number | 'fastest-lap',
  driver: Driver | undefined,
  raceFinalResults?: UserVote[] | null
) => boolean = (
  position: number | 'fastest-lap',
  driver: Driver | undefined,
  raceFinalResults?: UserVote[] | null
): boolean => {
  if (!driver || !raceFinalResults) {
    return false;
  }
  return !!raceFinalResults.find(
    (userVote: UserVote) =>
      userVote.driver.id === driver.id &&
      (position !== 'fastest-lap'
        ? userVote.driver_final_position === position
        : userVote.is_fastest_lap_vote)
  );
};
