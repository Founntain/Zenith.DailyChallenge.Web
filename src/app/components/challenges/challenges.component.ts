import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ChallengeComponent} from "../challenge/challenge.component";
import {ZenithTextWobbleComponent} from "../zenith-text-wobble/zenith-text-wobble.component";
import {Difficulty} from '../../services/network/data/enums/Difficulty';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {TodayCompletions} from '../../services/network/data/interfaces/TodayCompletions';
import {Condition} from '../../services/network/data/interfaces/Condition';
import {NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {ZenithService} from '../../services/network/zenith.service';
import {firstValueFrom, interval, Observable, take} from 'rxjs';
import {TimeHelper} from '../../util/TimeHelper';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {UserSessionService} from '../../services/user-session.service';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {WeeklyChallenge, WeeklyChallengeProgress} from '../../services/network/data/interfaces/WeeklyChallenge';
import {ChallengeHelper} from '../../util/ChallengeHelper';
import {DailyHelper} from '../../util/DailyHelper';

@Component({
  selector: 'app-challenges',
  imports: [
    ChallengeComponent,
    ZenithTextWobbleComponent,
    NgClass,
    MatIcon,
    MatTabGroup,
    MatTab
  ],
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.scss'
})
export class ChallengesComponent implements OnInit, OnDestroy {
  public user$: Observable<UserProfileData | null>;
  protected readonly Difficulty = Difficulty;
  protected readonly ChallengeHelperObj = ChallengeHelper;

  private timerId: any;

  date: string = "";
  timeLeft: string = "";
  runsUntilUnixSeconds: number = 0;

  dailyChallenges: DailyChallenge[] = [];
  todayUsersCompletions: TodayCompletions | undefined;

  weeklyChallenge: WeeklyChallenge | undefined;
  weeklyChallengeProgress: WeeklyChallengeProgress | undefined;

  constructor(
    private readonly zenithService: ZenithService,
    private readonly userService: ZenithUserService,
    private readonly ngZone: NgZone,
    private readonly session: UserSessionService
  ) {
    this.user$ = this.session.user$;
  }

  ngOnInit(): void {
    this.zenithService.getDailyChallenges().subscribe(result => {
      this.dailyChallenges = result;
    })

    this.zenithService.getDates().subscribe(result => {
      this.date = result.dateString;
      this.runsUntilUnixSeconds = result.runsUntilUnixSeconds;

      this.ngZone.runOutsideAngular(() => {
        this.timerId = interval(1000).subscribe(() => {
          this.ngZone.run(() => {
            this.updateTimeLeft();
          });
        });
      });
    })

    this.zenithService.getWeekly().subscribe(result => {
      this.weeklyChallenge = result;
    })

    this.loadUsersTodaysCompletions();
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      this.timerId.unsubscribe();
    }
  }

  private updateTimeLeft(){
    if(this.runsUntilUnixSeconds == 0 && this.date == "") return;

    const currentDate = new Date();
    const targetDate = new Date(this.runsUntilUnixSeconds * 1000);

    const timeDifference = targetDate.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      this.timeLeft = "Time's up!";
      return;
    }

    let timeTuple = TimeHelper.unixSecondsToString(timeDifference);

    this.timeLeft = `${timeTuple[1]}h ${timeTuple[2]}m ${timeTuple[3]}s`;
  }

  public async loadUsersTodaysCompletions() {

    const user = await firstValueFrom(this.user$.pipe(take(1)));

    if(user){
      this.userService.getTodaysChallengeCompletions(user.username).subscribe(result => {
        this.todayUsersCompletions = result;
      })

      this.zenithService.getWeeklyProgression(user.username).subscribe(result => {
        this.weeklyChallengeProgress = result;
      })
    }else{
      this.user$.subscribe(user => {
        if(user){
          this.userService.getTodaysChallengeCompletions(user.username).subscribe(result => {
            this.todayUsersCompletions = result;
          })

          this.zenithService.getWeeklyProgression(user.username).subscribe(result => {
            this.weeklyChallengeProgress = result;
          })
        }
      })
    }
  }

  getChallengeOfDifficulty(difficulty: Difficulty): DailyChallenge {
    switch (difficulty) {
      case Difficulty.Easy:
        return this.dailyChallenges.find(x => x.points == Difficulty.Easy)!
      case Difficulty.Normal:
        return this.dailyChallenges.find(x => x.points == Difficulty.Normal)!
      case Difficulty.Hard:
        return this.dailyChallenges.find(x => x.points == Difficulty.Hard)!
      case Difficulty.Expert:
        return this.dailyChallenges.find(x => x.points == Difficulty.Expert)!
      case Difficulty.Reverse:
        return this.dailyChallenges.find(x => x.points == Difficulty.Reverse)!
    }

    return {} as DailyChallenge;
  }

  getMasteryChallengeConditions(isReverse: boolean = false): Condition[] {
    let conditions = this.dailyChallenges.find(x => x.isMasteryChallenge && x.isReverse == isReverse);

    if (conditions == undefined) return [];

    return conditions.conditions
  }

  getChallengeCompletionOfDifficulty(difficulty: Difficulty): boolean {
    switch (difficulty) {
      case Difficulty.Easy:
        return this.todayUsersCompletions?.easyCompleted ?? false
      case Difficulty.Normal:
        return this.todayUsersCompletions?.normalCompleted ?? false
      case Difficulty.Hard:
        return this.todayUsersCompletions?.hardCompleted ?? false
      case Difficulty.Expert:
        return this.todayUsersCompletions?.expertCompleted ?? false
      case Difficulty.Reverse:
        return this.todayUsersCompletions?.reverseCompleted ?? false
    }

    return false;
  }

  getModMasteryCompletionCssClass(modStatus: boolean | undefined) {
    return modStatus ? '' : 'grayScale'
  }

  getMasteryPrefix(type: ConditionType) {
    switch(type){
      case ConditionType.KOs:
        return `Get `;
      case ConditionType.Height:
        return `Reach `;
      case ConditionType.Quads:
        return `Clear `;
      case ConditionType.Spins:
        return `Clear `;
      case ConditionType.AllClears:
        return `Get `;
      case ConditionType.Apm:
        return `Get `;
      case ConditionType.Pps:
        return `Get `;
      case ConditionType.Vs:
        return `Get `;
      case ConditionType.Finesse:
        return `Achieve `;
      case ConditionType.Back2Back:
        return `Obtain `;
      default:
        return ""
    }
  }

  getMasterySuffix(type: ConditionType) {
    switch(type){
      case ConditionType.KOs:
        return ' KOs';
      case ConditionType.Height:
        return 'M';
      case ConditionType.Quads:
        return ' Quads';
      case ConditionType.Spins:
        return ' Spins';
      case ConditionType.AllClears:
        return ' All Clears';
      case ConditionType.Apm:
        return ' APM';
      case ConditionType.Pps:
        return ' PPS';
      case ConditionType.Vs:
        return ' VS';
      case ConditionType.Finesse:
        return '% FINESSE';
      case ConditionType.Back2Back:
        return ' B2B';
      default:
        return []
    }
  }

  protected readonly ChallengeHelper = ChallengeHelper;

  protected getWeeklyChallengeProgress($index: number): string {
    if(!this.weeklyChallengeProgress?.progress) return "0"

    return DailyHelper.roundNumber(this.weeklyChallengeProgress.progress[$index]?.currentProgress ?? 0);
  }

  protected getWeeklyCompletionImage($index: number, value: number) {
    if(!this.weeklyChallengeProgress?.progress) return "assets/weekly-not-done.png";

    return (this.weeklyChallengeProgress.progress[$index]?.isCompleted ?? false) ? "assets/weekly-done.png" : "assets/weekly-not-done.png";
  }

  protected getWeeklyObjectiveCompletedCount(): number{
    let amount = 0;

    if(!this.weeklyChallengeProgress?.progress) return amount;

    return this.weeklyChallengeProgress.progress.filter(progress => progress.isCompleted).length;
  }

  protected getWeeklyObjectiveCompletedCountPercentage(): number{
    if( ! this.weeklyChallengeProgress?.progress) return  0;

    let values:number[] = [];

    for (let i = 0; i < this.weeklyChallengeProgress.progress.length; i++) {
      let progress = this.weeklyChallengeProgress.progress[i].currentProgress;
      let targetValue = this.weeklyChallenge?.condtions[i].value ?? 0;

      if(progress === 0 || targetValue === 0){
        values.push(0)
        continue;
      }

      values.push(progress / targetValue * 100);
    }

    return values.reduce((acc, val) => acc + val, 0) / values.length;
  }

  protected getScores(){
    let scoreAchieved = 0;
    let maxScore = 0;

    if(! this.weeklyChallenge?.condtions) return  [scoreAchieved, maxScore];

    maxScore = (this.weeklyChallenge.condtions.length * 10) * 2;

    if( ! this.weeklyChallengeProgress?.progress) return  [scoreAchieved, maxScore];

    scoreAchieved = this.getWeeklyObjectiveCompletedCount();

    if(scoreAchieved > 0)
      scoreAchieved *= 10;

    return [scoreAchieved, maxScore]
  }
}
