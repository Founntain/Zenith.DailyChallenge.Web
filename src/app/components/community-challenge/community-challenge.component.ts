import {Component, NgZone, OnDestroy, OnInit, ChangeDetectionStrategy, inject, signal, effect} from '@angular/core';
import {CommunityChallenge} from '../../services/network/data/interfaces/CommunityChallenge';
import {RecentCommunityContribution} from '../../services/network/data/interfaces/RecentCommunityContribution';
import {interval, map, Observable} from 'rxjs';
import {ZenithService} from '../../services/network/zenith.service';
import {TimeHelper} from '../../util/TimeHelper';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {ZdcSessionService} from '../../services/zdc-session.service';
import {ChallengeHelper} from '../../util/ChallengeHelper';
import {MatRipple} from '@angular/material/core';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-community-challenge',
  imports: [
    NgClass,
    RouterLink,
    MatIcon,
    MatRipple,
  ],
  templateUrl: './community-challenge.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './community-challenge.component.scss'
})
export class CommunityChallengeComponent implements OnInit, OnDestroy{
  private readonly zenithService = inject(ZenithService);
  private readonly ngZone = inject(NgZone);
  private readonly session = inject(ZdcSessionService);

  public communityChallenge$: Observable<CommunityChallenge | null>;

  private timerId: any;
  private contributionTimerId: any;

  communityChallengeEndDateUnixSeconds = signal<number>(0)
  communityTimeLeft = signal<string>("")
  isCommunityChallengeFinished = signal<string>("")

  recentContributions = rxResource({
    stream: () => this.zenithService.getRecentCommunityContributions().pipe(map(res => res as RecentCommunityContribution[]))
  })

  protected readonly ChallengeHelper = ChallengeHelper;

  communityChallenge = rxResource({
    stream: () => this.zenithService.getCommunityChallenge().pipe(map(res => res as CommunityChallenge))
  })

  constructor(
  ) {
    this.communityChallenge$ = this.session.communityChallenge$;

    effect(() => {
      if(this.communityChallenge.isLoading() || !this.communityChallenge.hasValue()) return;

      const cc = this.communityChallenge.value();

      if(!cc) return;

      console.log('cc', cc)

      this.communityChallengeEndDateUnixSeconds.set(cc.endsAtUnixSeconds);

      if(cc.communityChallenge.finished === true){
        this.isCommunityChallengeFinished.set("goalAchieved");
      }else{
        this.isCommunityChallengeFinished.set("");
      }
    });
  }

  ngOnInit(): void {
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
    if(this.communityChallengeEndDateUnixSeconds() === undefined || this.communityChallengeEndDateUnixSeconds() == 0) return;

    const currentDate = new Date();
    const targetDate = new Date(this.communityChallengeEndDateUnixSeconds() * 1000);

    const timeDifference = targetDate.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      this.communityTimeLeft.set("Time's up!");
      return;
    }

    let timeTuple = TimeHelper.unixSecondsToString(timeDifference);

    this.communityTimeLeft.set(`${timeTuple[0]}d ${timeTuple[1]}h ${timeTuple[2]}m ${timeTuple[3]}s`);
  }

  private updateCommunityGoal() {
    this.session.fetchCommunityChallenge();

    this.communityChallenge.reload();
    this.recentContributions.reload();
  }

  getCommunityPromptPrefix() {
    let prompt = "";

    switch (this.communityChallenge.value()?.communityChallenge.conditionType){
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
    let value = this.communityChallenge.value()?.communityChallenge.targetValue.toLocaleString('en-US');

    switch (this.communityChallenge.value()?.communityChallenge.conditionType) {
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

    switch (this.communityChallenge.value()?.communityChallenge.conditionType){
      case ConditionType.Height:
        prompt = " while in search for salvation"
        break;
      case ConditionType.KOs:
        prompt = " lost souls searching for the gods"
        break;
      case ConditionType.Quads:
      case ConditionType.AllClears:
        prompt = " without making the walls fall"
        break;
      case ConditionType.Spins:
        prompt = " without getting dizzy"
        break;
      case ConditionType.Apm:
      case ConditionType.Pps:
      case ConditionType.Vs:
        prompt = " by unleashing the power of the gods within you"
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
}
