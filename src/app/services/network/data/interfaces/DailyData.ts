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
  altitudePercentages: number[];
  masteryCompletions: MasteryCompletions | undefined;
  score: number;
  seasonalScore: number;
}

export interface DailyDataNew {
  tetrioId: string;
  username: string;
  score: number;
  seasonalScore: number;
  avatar: number
  banner: number
  title: string;
  runs: number;
  topAltitude: number;
  garbageSend: number;
  garbageCleared: number;
  kos: number;
  timePlayed: number;
  altitudePercentages: number[];
}

export interface RecentAverage {
  date: string;
  average: number;
}

export interface UserAverages {
  average: number;
  recent: RecentAverage[];
  improvement: number;
}

export interface FloorAverages {
  average: number;
  floors: number[];
}

export interface DailyDataNewExtra {
  floors: FloorAverages;
  apm: UserAverages;
  vs: UserAverages;
  pps: UserAverages;
  altitude: UserAverages
}
