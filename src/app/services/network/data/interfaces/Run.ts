import {Splits} from './Splits';

export interface Run {
  tetrioId: string;
  mods: string;
  altitude: number;
  quads: number;
  spins: number;
  allclears: number;
  kos: number;
  apm: number;
  pps: number;
  vs: number;
  finesse: number;
  back2back: number;
  speedrunSeen: boolean;
  speedrunCompleted: boolean;
}

export interface DetailedRun extends Run {
  playedAt: string
  kOs: number
  allClears: number
  back2Back: number
  totalBonus: number
  linesCleared: number
  inputs: number
  holds: number
  score: number
  topCombo: number
  piecesPlaced: number
  rank: number
  peakRank: number
  averageRankPoints: number
  floor: number
  targetingFactor: number
  targetingGrace: number
  gameOverReason: string
  garbageSent: number
  garbageSendNoMult: number
  garbageMaxSpike: number
  garbageMaxSpikeNoMult: number
  garbageReceived: number
  garbageAttack: number
  garbageCleared: number
  totalTime: number
  peakPosition: number
  finalPosition: number
  peakPlayerCount: number
  finalPlayerCount: number
  app: number
  userId: string
  id: string
}

export interface RunResponse {
  run: DetailedRun,
  split: Splits,
}
