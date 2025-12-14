import {BaseData} from './BaseData';
import {Condition} from './Condition';

export interface DailyChallenge extends BaseData {
  date: string;
  conditions: Condition[];
  mods: string;
  completions: number;
  isMasteryChallenge: boolean;
  isReverse: boolean;
  difficulty: number;
  points: number;
}
