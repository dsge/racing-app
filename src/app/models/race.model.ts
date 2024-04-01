export interface Race {
  id?: number;
  race_name: string;
  /**
   * which year the drivers should be queried from
   */
  drivers_from_year: number;
  race_start_date: string;
  race_end_date: string;
}
