export interface TodayCompletions {
  date: string;
  veryEasyCompleted: boolean;
  easyCompleted: boolean;
  normalCompleted: boolean;
  hardCompleted: boolean;
  expertCompleted: boolean;
  reverseCompleted: boolean;
  masteryChallenge: MasteryChallengeCompletion;
}

export interface MasteryChallengeCompletion {
  expertCompleted: boolean;
  noHoldCompleted: boolean;
  messyCompleted: boolean;
  gravityCompleted: boolean;
  volatileCompleted: boolean;
  doubleHoleCompleted: boolean;
  invisibleCompleted: boolean;
  allSpinCompleted: boolean;

  expertReversedCompleted: boolean;
  noHoldReversedCompleted: boolean;
  messyReversedCompleted: boolean;
  gravityReversedCompleted: boolean;
  volatileReversedCompleted: boolean;
  doubleHoleReversedCompleted: boolean;
  invisibleReversedCompleted: boolean;
  allSpinReversedCompleted: boolean;
}
