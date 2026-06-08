import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {CommunityChallenge} from '../../services/network/data/interfaces/CommunityChallenge';
import {RecentCommunityContribution} from '../../services/network/data/interfaces/RecentCommunityContribution';
import {interval} from 'rxjs';
import {ZenithService} from '../../services/network/zenith.service';
import {TimeHelper} from '../../util/TimeHelper';
import {NumberUtils} from '../../util/NumberUtils';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {NgClass} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-community-challenge',
  imports: [
    NgClass,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    RouterLink,
    MatIcon,
    MatHeaderRow,
    MatRow,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef
  ],
  templateUrl: './community-challenge.component.html',
  styleUrl: './community-challenge.component.scss'
})
export class CommunityChallengeComponent implements OnInit, OnDestroy{
  private timerId: any;
  private contributionTimerId: any;

  communityChallengeEndDateUnixSeconds: number = 0;
  communityChallengeData: CommunityChallenge | undefined;

  communityTimeLeft: string = "";
  isCommunityChallengeFinished: string = "";

  recentContributions: RecentCommunityContribution[] = [];

  constructor(
    private readonly zenithService: ZenithService,
    private readonly ngZone: NgZone
  ) {
  }

  ngOnInit(): void {
    this.zenithService.getCommunityChallenge().subscribe(result => {
      this.communityChallengeData = result;
      this.communityChallengeEndDateUnixSeconds = result.endsAtUnixSeconds;
    })

    this.zenithService.getDates().subscribe(result => {
      this.ngZone.runOutsideAngular(() => {
        this.timerId = interval(1000).subscribe(() => {
          this.ngZone.run(() => {
            this.updateCommunityTimeLeft();
          });
        });
      });
    })

    this.ngZone.runOutsideAngular(() => {
      this.contributionTimerId = interval(10000).subscribe(() => {
        this.ngZone.run(() => {
          this.updateCommunityGoal();
        });
      });
    });

    this.updateCommunityGoal();
  }

  ngOnDestroy() {
    if (this.contributionTimerId) {
      this.contributionTimerId.unsubscribe();
    }
  }

  private updateCommunityTimeLeft(){
    if(this.communityChallengeEndDateUnixSeconds == 0) return;

    const currentDate = new Date();
    const targetDate = new Date(this.communityChallengeEndDateUnixSeconds * 1000);

    const timeDifference = targetDate.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      this.communityTimeLeft = "Time's up!";
      return;
    }

    let timeTuple = TimeHelper.unixSecondsToString(timeDifference);

    this.communityTimeLeft = `${timeTuple[0]}d ${timeTuple[1]}h ${timeTuple[2]}m ${timeTuple[3]}s`;
  }

  private updateCommunityGoal() {
    this.zenithService.getCommunityChallenge().subscribe(result => {
      this.communityChallengeData = result;
      this.communityChallengeEndDateUnixSeconds = result.endsAtUnixSeconds;

      if(this.communityChallengeData?.communityChallenge === undefined) return;

      if(this.communityChallengeData.communityChallenge.finished === true){
        this.isCommunityChallengeFinished = "goalAchieved"
      }else{
        this.isCommunityChallengeFinished = ""
      }
    })

    this.zenithService.getRecentCommunityContributions().subscribe(result => {
      this.recentContributions = result;
    })
  }

  getCommunityPromptPrefix() {
    let prompt = "";

    switch (this.communityChallengeData?.communityChallenge.conditionType){
      case ConditionType.Height:
        prompt = "Climb a total of "
        break;
      case ConditionType.KOs:
        prompt = "Eradicate a total of "
        break;
      case ConditionType.Quads:
      case ConditionType.Spins:
      case ConditionType.AllClears:
        prompt = "Clear a total of "
        break;
      case ConditionType.Apm:
      case ConditionType.Pps:
      case ConditionType.Vs:
        prompt = "Achieve a total of "
        break;
      case ConditionType.TotalBonus:
        prompt = "Achieve "
        break;
      default:
        prompt = "--- IF YOU SEE THIS TELL FOUNNTAIN HE FORGOT SOMETHING. [1] ---"
        break;
    }

    return prompt;
  }

  getCommunityPromptValue() {
    let prompt = "";
    let value = this.communityChallengeData?.communityChallenge.targetValue.toLocaleString('en-US');

    switch (this.communityChallengeData?.communityChallenge.conditionType) {
      case ConditionType.Height:
        prompt = `${value} M`
        break;
      case ConditionType.KOs:
        prompt = `${value} `
        break;
      case ConditionType.Quads:
        prompt = `${value} quads`
        break;
      case ConditionType.Spins:
        prompt = `${value} spins`
        break;
      case ConditionType.AllClears:
        prompt = `${value} all clears`
        break;
      case ConditionType.Apm:
        prompt = `${value} APM`
        break;
      case ConditionType.Pps:
        prompt = `${value} PPS`
        break;
      case ConditionType.Vs:
        prompt = `${value} VS`
        break;
      case ConditionType.TotalBonus:
        prompt = `${value} Bonus`
        break;
      default:
        prompt = "--- IF YOU SEE THIS TELL FOUNNTAIN HE FORGOT SOMETHING. [2] ---"
        break;
    }

    return prompt;
  }

  getCommunityPromptSuffix() {
    let prompt = "";

    switch (this.communityChallengeData?.communityChallenge.conditionType){
      case ConditionType.Height:
        prompt = ", while in search for salvation"
        break;
      case ConditionType.KOs:
        prompt = " lost souls searching for the gods"
        break;
      case ConditionType.Quads:
      case ConditionType.AllClears:
        prompt = ", without making the walls fall"
        break;
      case ConditionType.Spins:
        prompt = ", without getting dizzy"
        break;
      case ConditionType.Apm:
      case ConditionType.Pps:
      case ConditionType.Vs:
        prompt = ", by unleashing the power of the gods within you"
        break;
      case ConditionType.TotalBonus:
        prompt = " while exploring the heights of Zenith"
        break;
      default:
        prompt = "--- IF YOU SEE THIS TELL FOUNNTAIN HE FORGOT SOMETHING. [3] ---"
        break;
    }

    return prompt;
  }

  getCommunityPromptProgressSuffix() {
    let prompt = "";

    switch (this.communityChallengeData?.communityChallenge.conditionType){
      case ConditionType.Height:
        prompt = "climbed"
        break;
      case ConditionType.KOs:
        prompt = " souls freed"
        break;
      case ConditionType.Quads:
        prompt = " quads cleared"
        break;
      case ConditionType.Spins:
        prompt = " spins cleared"
        break;
      case ConditionType.AllClears:
        prompt = " all clears cleared"
        break;
      case ConditionType.Apm:
        prompt = "apm unleashed"
        break;
      case ConditionType.Pps:
        prompt = "pps unleashed"
        break;
      case ConditionType.Vs:
        prompt = "vs unleashed"
        break;
      case ConditionType.TotalBonus:
        prompt = " acquired"
        break;
      default:
        prompt = "--- IF YOU SEE THIS TELL FOUNNTAIN HE FORGOT SOMETHING. [4] ---"
        break;
    }

    return prompt;
  }

  getContributionValue(value: number, conditionType: ConditionType) {
    let sValue = value.toLocaleString('en-US');

    switch (conditionType) {
      case ConditionType.Height:
        return `${sValue} M`
      case ConditionType.KOs:
        return `${sValue} KO's`
      case ConditionType.Quads:
        return `${sValue} quads`
      case ConditionType.Spins:
        return `${sValue} spins`
      case ConditionType.AllClears:
        return `${sValue} all clears`
      case ConditionType.Apm:
        return `${sValue} APM`
      case ConditionType.Pps:
        return `${sValue} PPS`
      case ConditionType.Vs:
        return `${sValue} VS`
      case ConditionType.TotalBonus:
        return `${sValue} Bonus`
      default:
        return"--- IF YOU SEE THIS TELL FOUNNTAIN HE FORGOT SOMETHING. [5] ---"
    }
  }

  getCommunityGoalPercentage(currentValue: number, target: number) {
    return `${Math.round((currentValue / target) * 100)}%`;
  }
}
