import {Condition} from './Condition';

export interface WeeklyChallenge {
  week: number;
  startDate: string;
  endDate: number;
  mods: string;
  condtions: Condition[]
}

export interface WeeklyChallengeProgress {
  week: number;
  isCompleted: boolean;
  progress: WeeklyChallengeConditionProgress[];
}

export interface WeeklyChallengeConditionProgress {
  type: number;
  currentProgress: number;
  isCompleted: boolean;
}
