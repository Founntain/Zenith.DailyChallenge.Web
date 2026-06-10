import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {ZenithService} from '../../services/network/zenith.service';
import {ChallengeHelper} from '../../util/ChallengeHelper';
import {DailyHelper} from '../../util/DailyHelper';
import {Condition} from '../../services/network/data/interfaces/Condition';
import {AsyncPipe, DatePipe, NgOptimizedImage} from '@angular/common';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {firstValueFrom, Observable, take} from 'rxjs';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {ZdcSessionService} from '../../services/zdc-session.service';
import {RouterLink} from '@angular/router';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';
import {TodayCompletions} from '../../services/network/data/interfaces/TodayCompletions';

@Component({
  selector: 'app-challenges-new',
  imports: [
    MatIcon,
    DatePipe,
    AsyncPipe
  ],
  templateUrl: './challenges-new.component.html',
  styleUrl: './challenges-new.component.scss'
})
export class ChallengesNewComponent implements OnInit, OnDestroy {
  public user$: Observable<UserProfileData | null>;
  public dailyChallenges$: Observable<DailyChallenge[] | null>;
  public challengeCompletions$: Observable<TodayCompletions | null>;
  challenges: Challenge[] = [];
  masteryChallenges: Challenge[] = [];
  currentIndex = 0;
  autoPlayInterval?: any;

  protected readonly ChallengeHelper = ChallengeHelper;

  constructor(
    private zenithService: ZenithService,
    private userService: ZenithUserService,
    private readonly session: ZdcSessionService
  ) {
    this.user$ = this.session.user$;
    this.dailyChallenges$ = this.session.dailies$;
    this.challengeCompletions$ = this.session.challengeCompletions$;
  }

  ngOnInit() {
    this.dailyChallenges$.subscribe(async challenges => {
      if(challenges === undefined || challenges === null) return;

      this.challenges = [];
      this.masteryChallenges = [];

      for (let i = 0; i < challenges.length; i++) {
        let challenge = challenges[i];

        if(challenge === undefined || challenge === null) continue;
        if (challenge.isMasteryChallenge) continue;

        let c: Challenge = {
          id: challenge.id,
          number: challenge.date,
          modString: challenge.mods,
          mods: DailyHelper.getModArray(challenge.mods).map(mod => DailyHelper.getModImageUrl(mod)),
          difficulty: challenge.points,
          difficultyText: ChallengeHelper.getDifficultyText(challenge.points, '', true).toLowerCase(),
          imageUrl: 'https://tetr.io/res/bg/zenith/' + DailyHelper.getFloorByAltitude(challenge.conditions[0].value) + 'fa.jpg',
          remainingTime: (challenge.completions ?? 0).toLocaleString(),
          stats: this.getStatsFromConditions(challenge.conditions),
          isReverse: challenge.isReverse,
          isCompleted: false
        }

        this.challenges.push(c);
      }

      for(let i = 0; i< challenges.length; i++){
        let challenge = challenges[i];

        if(challenge === undefined || challenge === null) continue;
        if (!challenge.isMasteryChallenge) continue;

        let c: Challenge = {
          id: challenge.id,
          number: challenge.date,
          modString: challenge.mods,
          mods: DailyHelper.getModArray(challenge.mods).map(mod => DailyHelper.getModImageUrl(mod)),
          difficulty: challenge.points,
          difficultyText: ChallengeHelper.getDifficultyText(challenge.points, '', true).toLowerCase(),
          imageUrl: 'https://tetr.io/res/bg/zenith/' + DailyHelper.getFloorByAltitude(challenge.conditions[0].value) + 'fa.jpg',
          remainingTime: (challenge.completions ?? 0).toLocaleString(),
          stats: this.getStatsFromConditions(challenge.conditions),
          isReverse: challenge.isReverse,
          isCompleted: false
        }

        this.masteryChallenges.push(c);
      }

      await this.loadTodaysCompletions();
    });

    // Optional: Auto-play
    // this.startAutoPlay();
  }

  private getStatsFromConditions(conditions: Condition[]): any {
    let result = [];

    for (const condition of conditions) {
      const stat = ChallengeHelper.getStatFromCondition(condition.type, condition.value);

      if (stat) {
        result.push(stat);
      }
    }

    return result;
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.resetAutoPlay();
  }

  private startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (this.currentIndex < this.challenges.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    }, 10000); // Change slide every 10 seconds
  }

  private stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  private resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  submitRuns() {
    this.session.submitAndUpdate();
  }

  private async loadTodaysCompletions() {
    const user = await firstValueFrom(this.user$.pipe(take(1)));

    this.challengeCompletions$.subscribe(result => {
      if(result === undefined || result === null) return;

      for (const id of result.completedChallengesIds ?? []) {
        const challenge = this.challenges.find(c => c.id === id);
        if (challenge) {
          challenge.isCompleted = true;
        }
      }
    })
  }

  protected signIn() {
    DailyHelper.signIn();
  }

  protected getCompletionPercentage(challenge: Challenge) {
    let countCompleted = 0;

    const completions = this.session?.snapshotChallengeCompletions?.masteryChallenge;

    if(!completions) return 0;

    if(challenge.isReverse){
      if(completions.expertReversedCompleted) countCompleted++;
      if(completions.noHoldReversedCompleted) countCompleted++;
      if(completions.messyReversedCompleted) countCompleted++;
      if(completions.gravityReversedCompleted) countCompleted++;
      if(completions.volatileReversedCompleted) countCompleted++;
      if(completions.doubleHoleReversedCompleted) countCompleted++;
      if(completions.invisibleReversedCompleted) countCompleted++;
      if(completions.allSpinReversedCompleted) countCompleted++;

    }else{
      if(completions.expertCompleted) countCompleted++;
      if(completions.noHoldCompleted) countCompleted++;
      if(completions.messyCompleted) countCompleted++;
      if(completions.gravityCompleted) countCompleted++;
      if(completions.volatileCompleted) countCompleted++;
      if(completions.doubleHoleCompleted) countCompleted++;
      if(completions.invisibleCompleted) countCompleted++;
      if(completions.allSpinCompleted) countCompleted++;
    }

    if(countCompleted == 0) return 0;

    return countCompleted / 8 * 100
  }
}

interface Challenge {
  id: string;
  number: string;
  modString: string;
  mods: string[];
  difficulty: number;
  difficultyText: string;
  imageUrl: string;
  remainingTime: string;
  stats: { icon: string; prefix: string, value: string; label: string }[];
  isReverse: boolean;
  isCompleted: boolean;
}
