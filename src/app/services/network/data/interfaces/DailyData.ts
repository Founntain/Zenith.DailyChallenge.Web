import {Splits} from './Splits';
import {SlimUserinfo} from './SlimUserinfo';
import {Altitudes} from './Altitudes';
import {MasteryCompletions} from './MasteryCompletions';

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
  splitAverages: Splits;
  goldSplits: Splits;
}
