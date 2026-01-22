export interface GlobalLeaderboard {
  totalUsers: number;
  leaderboard: GlobalLeaderboardEntry[]
}

export interface GlobalLeaderboardEntry {
  username: string;
  score: number;
  easyChallengesCompleted: number;
  normalChallengesCompleted: number;
  hardChallengesCompleted: number;
  expertChallengesCompleted: number;
  reverseChallengesCompleted: number;
  masteryChallengesCompleted: number;
}

export interface SeasonalLeaderboard {
  name: string;
  description: string;

  startDate: string;
  endDate: string;
  startedAtUnixSeconds: number;
  endsAtUnixSeconds: number;

  leaderboard: SeasonalLeaderboardEntry[]
}

export interface SeasonalLeaderboardEntry {
  rank: string;
  username: string;
  score: number;
}

export interface SeasonalPlacement{
  placement: number;
  seasonName: string;
}
