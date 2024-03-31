export interface Driver {
  id?: number;
  full_name: string;
  /**
   * the year when this driver races
   *
   * if the driver races in multiple years then multiple records need to be added with the same full_name
   */
  year_of_racing: number;
  /**
   * additional notes in an unstructured format ( e.g. team name )
   */
  freetext_notes?: string;
}
