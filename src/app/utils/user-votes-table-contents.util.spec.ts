import { Driver } from '../models/driver.model';
import { Race, RaceScoreScreenVotes } from '../models/race.model';
import { UserVote, UserVoteRecord } from '../models/user-vote.model';
import { raceAndScooreScreenVotesToUserVotesTableContents } from './user-votes-table-contents.util';

describe('user-votes-table-contents.util.ts', () => {
  describe('raceAndScooreScreenVotesToUserVotesTableContents', () => {
    describe('tableColumns', () => {
      it('should return some tableColumns for a normal race', () => {
        expect(
          raceAndScooreScreenVotesToUserVotesTableContents(
            {} as Race,
            { userVotes: [] } as RaceScoreScreenVotes,
            [] as Driver[]
          ).tableColumns.length
        ).toBeGreaterThan(0);
      });

      it('should return some tableColumns for a sprint race', () => {
        expect(
          raceAndScooreScreenVotesToUserVotesTableContents(
            { is_sprint_race: true } as Race,
            { userVotes: [] } as RaceScoreScreenVotes,
            [] as Driver[]
          ).tableColumns.length
        ).toBeGreaterThan(0);
      });
    });
    describe('tableRows', () => {
      describe('no final results', () => {
        it('should return no rows when there are no user votes', () => {
          expect(
            raceAndScooreScreenVotesToUserVotesTableContents(
              {} as Race,
              { userVotes: [] } as RaceScoreScreenVotes,
              [] as Driver[]
            ).tableRows.length
          ).toBe(0);
        });

        it('should return 2 rows when there are 2 user votes for normal races', () => {
          expect(
            raceAndScooreScreenVotesToUserVotesTableContents(
              {} as Race,
              {
                userVotes: [
                  { user: {}, votes: [] as UserVoteRecord[] },
                  { user: {}, votes: [] as UserVoteRecord[] },
                ],
              } as RaceScoreScreenVotes,
              [] as Driver[]
            ).tableRows.length
          ).toBe(2);
        });

        it('should return 3 rows when there are 3 user votes for sprint races', () => {
          expect(
            raceAndScooreScreenVotesToUserVotesTableContents(
              { is_sprint_race: true } as Race,
              {
                userVotes: [
                  { user: {}, votes: [] as UserVoteRecord[] },
                  { user: {}, votes: [] as UserVoteRecord[] },
                  { user: {}, votes: [] as UserVoteRecord[] },
                ],
              } as RaceScoreScreenVotes,
              [] as Driver[]
            ).tableRows.length
          ).toBe(3);
        });
      });
      describe('with final results', () => {
        it('should return no rows when there are no user votes', () => {
          expect(
            raceAndScooreScreenVotesToUserVotesTableContents(
              {} as Race,
              {
                raceFinalResults: [] as UserVote[],
                userVotes: [],
              } as RaceScoreScreenVotes,
              [] as Driver[]
            ).tableRows.length
          ).toBe(0);
        });
        it('should calculate points for correct votes on normal races', () => {
          const fakeDriver: Driver = { id: 5 } as Driver;
          expect(
            raceAndScooreScreenVotesToUserVotesTableContents(
              {} as Race,
              {
                raceFinalResults: [
                  {
                    driver: fakeDriver,
                    driver_final_position: 2,
                  },
                ] as UserVote[],
                userVotes: [
                  {
                    user: {},
                    votes: [
                      { driver_final_position: 2, driver_id: 5 },
                    ] as UserVoteRecord[],
                  },
                ],
              } as RaceScoreScreenVotes,
              [fakeDriver] as Driver[]
            ).tableRows[0].finalPoints
          ).toBeGreaterThan(0);
        });
      });
      it('should calculate points for correct votes on normal races for fastest-lap', () => {
        const fakeDriver: Driver = { id: 5 } as Driver;
        expect(
          raceAndScooreScreenVotesToUserVotesTableContents(
            {} as Race,
            {
              raceFinalResults: [
                {
                  driver: fakeDriver,
                  is_fastest_lap_vote: true,
                },
              ] as UserVote[],
              userVotes: [
                {
                  user: {},
                  votes: [
                    { is_fastest_lap_vote: true, driver_id: 5 },
                  ] as UserVoteRecord[],
                },
              ],
            } as RaceScoreScreenVotes,
            [fakeDriver] as Driver[]
          ).tableRows[0].finalPoints
        ).toBeGreaterThan(0);
      });
      it('should calculate no points for correct votes on normal races where there are no known drivers', () => {
        const fakeDriver: Driver = { id: 5 } as Driver;
        expect(
          raceAndScooreScreenVotesToUserVotesTableContents(
            {} as Race,
            {
              raceFinalResults: [
                {
                  driver: fakeDriver,
                  is_fastest_lap_vote: true,
                },
              ] as UserVote[],
              userVotes: [
                {
                  user: {},
                  votes: [
                    { is_fastest_lap_vote: true, driver_id: 5 },
                  ] as UserVoteRecord[],
                },
              ],
            } as RaceScoreScreenVotes,
            [] as Driver[]
          ).tableRows[0].finalPoints
        ).toBe(0);
      });
      it('should calculate points for correct votes on sprint races', () => {
        const fakeDriver: Driver = { id: 5 } as Driver;
        expect(
          raceAndScooreScreenVotesToUserVotesTableContents(
            { is_sprint_race: true } as Race,
            {
              raceFinalResults: [
                {
                  driver: fakeDriver,
                  driver_final_position: 2,
                },
              ] as UserVote[],
              userVotes: [
                {
                  user: {},
                  votes: [
                    { driver_final_position: 2, driver_id: 5 },
                  ] as UserVoteRecord[],
                },
              ],
            } as RaceScoreScreenVotes,
            [fakeDriver] as Driver[]
          ).tableRows[0].finalPoints
        ).toBeGreaterThan(0);
      });
    });
  });
});
