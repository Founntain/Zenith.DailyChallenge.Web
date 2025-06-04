export interface DailyLeaderboard {
  totalUsers: number;
  leaderboard: DailyLeaderboardEntry[]
}

export interface DailyLeaderboardEntry {
  username: string;
  score: number;
  easyChallengesCompleted: number;
  normalChallengesCompleted: number;
  hardChallengesCompleted: number;
  expertChallengesCompleted: number;
  reverseChallengesCompleted: number;
  masteryChallengesCompleted: number;
}
