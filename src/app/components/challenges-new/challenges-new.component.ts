import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {ZenithService} from '../../services/network/zenith.service';
import {ChallengeHelper} from '../../util/ChallengeHelper';
import {DailyHelper} from '../../util/DailyHelper';
import {Condition} from '../../services/network/data/interfaces/Condition';
import {DatePipe, NgOptimizedImage} from '@angular/common';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {firstValueFrom, Observable, take} from 'rxjs';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {UserSessionService} from '../../services/user-session.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-challenges-new',
  imports: [
    MatIcon,
    DatePipe,
    RouterLink
  ],
  templateUrl: './challenges-new.component.html',
  styleUrl: './challenges-new.component.scss'
})
export class ChallengesNewComponent implements OnInit, OnDestroy {
  public user$: Observable<UserProfileData | null>;
  challenges: Challenge[] = [];
  currentIndex = 0;
  autoPlayInterval?: any;

  constructor(
    private zenithService: ZenithService,
    private userService: ZenithUserService,
    private readonly session: UserSessionService
  ) {
    this.user$ = this.session.user$;
  }

  ngOnInit() {
    this.zenithService.getDailyChallenges().subscribe(async challenges => {
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
          isCompleted: false
        }

        this.challenges.push(c);
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

  private lastUpdateSeconds = 0;

  submitRuns() {
    this.zenithService.submitRuns().subscribe({
      next: (r) => {
        // Do nothing
        this.lastUpdateSeconds = new Date().getTime() / 1000;

        // this.loadTodaysCompletions();
        window.location.reload();
      },
      error: (e) => {
        if(e.status == 400){
          alert(e.error);
        }
        if(e.status == 401){
          alert(e.error + '\n\nPlease login again.');
          // window.location.reload();
        }
      }
    })
  }

  private async loadTodaysCompletions() {
    const user = await firstValueFrom(this.user$.pipe(take(1)));

    if (user) {
      this.userService.getTodaysChallengeCompletions(user?.username).subscribe(result => {
        for (const id of result.completedChallengesIds ?? []) {
          const challenge = this.challenges.find(c => c.id === id);
          if (challenge) {
            challenge.isCompleted = true;
          }
        }
      })
    }else{
      this.user$.subscribe(user => {
        if(user){
          this.userService.getTodaysChallengeCompletions(user?.username).subscribe(result => {
            console.log(result)

            for (const id of result.completedChallengesIds ?? []) {
              const challenge = this.challenges.find(c => c.id === id);

              console.log(id, challenge)

              if (challenge) {
                challenge.isCompleted = true;
              }
            }
          })
        }
      })
    }
  }

  protected readonly ChallengeHelper = ChallengeHelper;
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
  stats: { icon: string; value: string; label: string }[];
  isCompleted: boolean;
}
