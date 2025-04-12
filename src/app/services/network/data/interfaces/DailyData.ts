import {Splits} from './Splits';
import {SplitsWithId} from './SplitsWithId';
import {Run} from './Run';
import {SlimUserinfo} from './SlimUserinfo';

export interface DailyData {
  username: string;
  tetrioId: string;
  runs: number;
  splits: number;
  challengesCompleted: number;
  userinfo: SlimUserinfo;
  splitAverages: Splits;
  goldSplits: Splits;
}

