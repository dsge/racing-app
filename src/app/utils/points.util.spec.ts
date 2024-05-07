import { getNormalRacePoints, getSprintRacePoints } from './points.util';

describe('points.util.ts', () => {
  describe('getNormalRacePoints', () => {
    it('should return a record of points per position', () => {
      expect(getNormalRacePoints()[1]).toBeGreaterThan(0);
    });
  });
  describe('getSprintRacePoints', () => {
    it('should return a record of points per position', () => {
      expect(getSprintRacePoints()[1]).toBeGreaterThan(0);
    });
  });
});
