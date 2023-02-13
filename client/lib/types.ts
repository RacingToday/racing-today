/** @format */

export interface MyRaceDay {
  id: number;
  attributes: {
    RaceDate: string;
    StartTime: string;
    EndTime: string;
    EventDescription: string;
    OrganizerEmail: string;
    Capacity: number;
    race_track: {
      data: {
        attributes: {
          TrackName: string;
          TrackDescription: string;
          Location: string;
        };
      };
    };
  };
}
