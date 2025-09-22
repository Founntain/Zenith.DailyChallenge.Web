import {Splits} from './Splits';
import {SlimUserinfo} from './SlimUserinfo';
import {Altitudes} from './Altitudes';
import {MasteryCompletions} from './MasteryCompletions';

interface Split {
  averageTime: string;
  bestTime: string;
  bestTimeAchievedDate: string;
}

interface ZenithSplits {
  hotel: Split
  casino: Split;
  arena: Split;
  museum: Split;
  offices: Split;
  laboratory: Split;
  core: Split;
  corruption: Split;
  potg: Split;
}

export interface DailyData {
  username: string;
  tetrioId: string;
  runs: number;
  splits: number;
  challengesCompleted: number;
  totalChallengesCompleted: number;
  userInfo: SlimUserinfo | undefined;
  altitudes: Altitudes;
  masteryCompletions: MasteryCompletions | undefined;
  score: number;
  splitTimes: ZenithSplits
}
