import {BaseData} from './BaseData';
import {Condition} from './Condition';

export interface DailyChallenge extends BaseData {
  date: string;
  conditions: Condition[];
  mods: string;
  difficulty: number;
  points: number;
}
