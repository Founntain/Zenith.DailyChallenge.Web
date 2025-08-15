import {ConditionType} from '../enums/ConditionType';

export interface CommunityChallengeArchive {
  challengeId: string;
  previousChallengeid: string | null;
  nextChallengeId: string | null;
  startDate: string;
  endDate: string;
  value: number;
  targetValue: number;
  conditionType: ConditionType,
  participants: CommunityChallengeParticipant[];
}

export interface CommunityChallengeParticipant {
  name: string;
  contributions: number;
}
