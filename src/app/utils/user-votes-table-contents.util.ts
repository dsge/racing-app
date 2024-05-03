import { Driver } from '../models/driver.model';
import {
  Race,
  RaceScoreScreenVote,
  RaceScoreScreenVotes,
} from '../models/race.model';
import {
  UserVotesTableContents,
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
  const finalResults: UserVote[] | undefined =
    raceScoreScreenVotes.raceFinalResults;
  const haveFinalResults: boolean = !!finalResults?.length;
  return raceScoreScreenVotes.userVotes.map((rowData: RaceScoreScreenVote) => {
    return {
      user: rowData.user,
      votes: tableColumns.map((tableColumn: VoteTableColumn) => {
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
      }),
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
