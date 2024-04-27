/**
 * @returns a list of numbers representing years, starting from `firstYear` up until the current year, e.g. [2023, 2024]
 */
export const getYearsListStartingFrom: (firstYear: number, now?: Date) => number[] = (firstYear: number, now: Date = new Date()): number[] => {
  const ret: number[] = [];
  let currentYear: number = now.getFullYear();
  if (currentYear <= firstYear) {
    currentYear = firstYear;
  }
  if (currentYear >= firstYear) {
    for (let year: number = firstYear; year <= currentYear; year++) {
      ret.push(year);
    }
  }
  return ret;
}
