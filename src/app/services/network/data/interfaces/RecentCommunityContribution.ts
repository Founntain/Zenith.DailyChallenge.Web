import {ConditionType} from '../enums/ConditionType';

export interface RecentCommunityContribution {
  username: string;
  amount: number;
  conditionType: ConditionType;
}
