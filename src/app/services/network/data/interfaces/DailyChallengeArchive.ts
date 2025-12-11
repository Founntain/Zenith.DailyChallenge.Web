import {Condition} from './Condition';

interface DailyChallengeArchiveUser {
  username: string;
  completedAt: Date;
}

export interface DailyChallengeArchive {
  date: string;
  minDate: string;
  maxDate: string;
  points: number;
  mods: string[];
  conditions: Condition[],
  users: DailyChallengeArchiveUser[]
}
