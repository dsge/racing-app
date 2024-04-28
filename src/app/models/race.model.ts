import { Driver } from "./driver.model";

export interface Race {
  id?: number;
  race_name: string;
  /**
   * which year the drivers should be queried from
   */
  drivers_from_year: number;
  race_start_date: string;
  race_end_date: string;
  voting_end_time?: string;
  /**
   * has the currently logged in user voted for this race already
   */
  current_user_has_voted?: boolean;
}

export interface VoteAndRaceRecordBase {
  id?: number,
  race_id?: number,
  driver_id?: number,
  driver_final_position?: number,
  is_fastest_lap_vote?: boolean,
}

export interface RaceFinalResultRecord extends VoteAndRaceRecordBase {}

export interface RaceFinalResult extends Pick<RaceFinalResultRecord, 'id' | 'driver_final_position'> {
  race?: Race,
  driver: Driver,
}
