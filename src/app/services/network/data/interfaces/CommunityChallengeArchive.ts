import {ConditionType} from '../enums/ConditionType';

export interface CommunityChallengeArchive {
  challengeId: string;
  previousChallengeid: string | null;
  nextChallengeId: string | null;
  startDate: string;
  endDate: string;
  name: string;
  description: string;
  value: number;
  targetValue: number;
  mods: string[];
  conditionType: ConditionType,
  participants: CommunityChallengeParticipant[];
}

export interface CommunityChallengeParticipant {
  name: string;
  contributions: number;
}
