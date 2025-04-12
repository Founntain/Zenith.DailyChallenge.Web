import {ConditionType} from '../enums/ConditionType';

export interface CommunityChallengeContributions {
  challenge: string;
  totalAmountContributed: number;
  conditionType: ConditionType,
  totalContributions: number;
}
