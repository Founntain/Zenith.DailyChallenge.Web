import {Altitudes} from './Altitudes';

export interface ServerStatistics {
  totalUsers: number;
  rankedUsers: number;
  totalScore: number;
  score: number;
  masteryScore: number;
  reverseCount: number;
  altitudes: Altitudes;
}
