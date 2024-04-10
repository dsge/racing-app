import { Driver } from "./driver.model"
import { Race, VoteAndRaceRecordBase } from "./race.model"

export interface UserVoteRecord extends VoteAndRaceRecordBase {
  user_uuid?: string
}

export interface UserVote extends Pick<UserVoteRecord, 'id' | 'driver_final_position' | 'user_uuid'> {
  race?: Race,
  driver: Driver,
}
