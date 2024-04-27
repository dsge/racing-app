import { getYearsListStartingFrom } from "./years";

describe('years.util.ts', () => {
  describe('getYearsListStartingFrom', () => {
    it('should return the years between 2015 and 2022', () => {
      expect(getYearsListStartingFrom(2015, new Date(2022, 6, 6))).toEqual([
        2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022
      ]);
    })

    it('should return 2021', () => {
      expect(getYearsListStartingFrom(2021, new Date(2019, 6, 6))).toEqual([
        2021
      ]);
    })
  })
});
