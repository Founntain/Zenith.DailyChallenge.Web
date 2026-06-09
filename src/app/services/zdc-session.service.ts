// user-session.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {UserProfileData} from './network/data/interfaces/UserProfileData';
import {DailyChallenge} from './network/data/interfaces/DailyChallenge';
import {TodayCompletions} from './network/data/interfaces/TodayCompletions';
import {CommunityChallenge} from './network/data/interfaces/CommunityChallenge';
import {ZenithService} from './network/zenith.service';
import {ZenithUserService} from './network/zenith-user.service';
import {WeeklyChallenge, WeeklyChallengeProgress} from './network/data/interfaces/WeeklyChallenge';

@Injectable({ providedIn: 'root' })
export class ZdcSessionService {
  constructor(private zenithService: ZenithService, private userService: ZenithUserService) {
  }

  private readonly _user$ = new BehaviorSubject<UserProfileData | null>(null);
  private readonly _dailies$ = new BehaviorSubject<DailyChallenge[] | null>(null);
  private readonly _challengeCompletions$ = new BehaviorSubject<TodayCompletions | null>(null);
  private readonly _communityChallenge = new BehaviorSubject<CommunityChallenge | null>(null);
  private readonly _weekly = new BehaviorSubject<WeeklyChallenge | null>(null);
  private readonly _weeklyProgress = new BehaviorSubject<WeeklyChallengeProgress | null>(null);

  readonly user$ = this._user$.asObservable();
  readonly dailies$ = this._dailies$.asObservable();
  readonly challengeCompletions$ = this._challengeCompletions$.asObservable();
  readonly communityChallenge$ = this._communityChallenge.asObservable();
  readonly weekly$ = this._weekly.asObservable();
  readonly weeklyProgress$ = this._weeklyProgress.asObservable();

  setUser(user: UserProfileData | null) {
    this._user$.next(user);
  }

  setDailyChallenge(dailyChallenges: DailyChallenge[] | null) {
    this._dailies$.next(dailyChallenges);
  }

  setChallengeCompletions(challengeCompletions: TodayCompletions | null) {
    this._challengeCompletions$.next(challengeCompletions);
  }

  setCommunityChallenge(communityChallenge: CommunityChallenge | null) {
    this._communityChallenge.next(communityChallenge);
  }

  setWeeklyChallenge(weeklyChallenge: WeeklyChallenge | null) {
    this._weekly.next(weeklyChallenge);
  }

  setWeeklyProgression(weeklyChallenge: WeeklyChallengeProgress | null) {
    this._weeklyProgress.next(weeklyChallenge);
  }

  get snapshotUser(): UserProfileData | null {
    return this._user$.value;
  }

  get snapshotDailyChallenges(): DailyChallenge[] | null {
    return this._dailies$.value;
  }

  get snapshotChallengeCompletions(): TodayCompletions | null {
    return this._challengeCompletions$.value;
  }

  get snapshotCommunityChallenge(): CommunityChallenge | null {
    return this._communityChallenge.value;
  }

  get snapshotWeeklyChallenge(): WeeklyChallenge | null {
    return this._weekly.value;
  }

  get snapshotWeeklyProgression(): WeeklyChallengeProgress | null {
    return this._weeklyProgress.value;
  }

  public submitAndUpdate(){
    this.zenithService.submitRuns().subscribe({
      next: (r) => {
        // Do nothing

        this.fetchDailyChallenges();
        this.fetchChallengeCompletions();
        this.fetchWeeklyProgress();
      },
      error: (e) => {
        if(e.status == 400){
          alert(e.error);
        }
        if(e.status == 401){
          alert(e.error + '\n\nPlease login again.');
        }
      }
    })
  }

  public fetchDailyChallenges(){
    this.zenithService.getDailyChallenges().subscribe((dailyChallenges) => {
      this.setDailyChallenge(dailyChallenges);
    });
  }

  public fetchCommunityChallenge(){
    this.zenithService.getCommunityChallenge().subscribe((communityChallenge) => {
      this.setCommunityChallenge(communityChallenge);
    });
  }

  public fetchChallengeCompletions(){
    const username = this.snapshotUser?.username;

    if(username === undefined) return;

    this.userService.getTodaysChallengeCompletions(username).subscribe((challengeCompletions) => {
      this.setChallengeCompletions(challengeCompletions);
    });
  }

  public fetchWeeklyChallenge(){
    this.zenithService.getWeekly().subscribe((weeklyChallenge) => {
      this.setWeeklyChallenge(weeklyChallenge);
    });
  }

  public fetchWeeklyProgress(){
    const username = this.snapshotUser?.username;

    if(username === undefined) return;

    this.zenithService.getWeeklyProgression(username).subscribe((weeklyChallenge) => {
      this.setWeeklyProgression(weeklyChallenge);
    });
  }

}
