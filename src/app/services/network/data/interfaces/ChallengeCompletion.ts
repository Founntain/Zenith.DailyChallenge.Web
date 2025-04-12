import {BaseData} from './BaseData';

export interface ChallengeCompletion {
  date: string;
  veryEasyCompleted: boolean;
  easyCompleted: boolean;
  normalCompleted: boolean;
  hardCompleted: boolean;
  expertCompleted: boolean;
}
