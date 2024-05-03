export const getNormalRacePoints: () => Record<
  number | 'fastest-lap',
  number
> = (): Record<number | 'fastest-lap', number> => {
  /**
   * position: pointvalue
   */
  return {
    1: 25,
    2: 18,
    3: 15,
    4: 12,
    5: 10,
    6: 8,
    7: 6,
    8: 4,
    9: 2,
    10: 1,
    'fastest-lap': 1,
  };
};

export const getSprintRacePoints: () => Record<number, number> = (): Record<
  number,
  number
> => {
  /**
   * position: pointvalue
   */
  return {
    1: 8,
    2: 7,
    3: 6,
    4: 5,
    5: 4,
    6: 3,
    7: 2,
    8: 1,
  };
};
