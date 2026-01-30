import {Component, OnDestroy, OnInit} from '@angular/core';
import {ZenithService} from '../../services/network/zenith.service';
import {ChallengeComponent} from '../../components/challenge/challenge.component';
import {AsyncPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';
import {firstValueFrom, interval, Observable, take} from 'rxjs';
import { NgZone } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {GlobalLeaderboard, SeasonalLeaderboard} from '../../services/network/data/interfaces/GlobalLeaderboard';
import {RouterLink} from '@angular/router';
import {CommunityChallenge} from '../../services/network/data/interfaces/CommunityChallenge';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {AuthService} from '../../services/network/auth.service';
import {RecentCommunityContribution} from '../../services/network/data/interfaces/RecentCommunityContribution';
import {Difficulty} from '../../services/network/data/enums/Difficulty';
import {CookieHelper} from '../../util/CookieHelper';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {TodayCompletions} from '../../services/network/data/interfaces/TodayCompletions';
import {Condition} from '../../services/network/data/interfaces/Condition';
import {SettingsService} from '../../services/settings.service';
import {ServerStatistics} from '../../services/network/data/interfaces/ServerStatistics';
import {MatTooltip} from '@angular/material/tooltip';
import {ZenithTextWobbleComponent} from '../../components/zenith-text-wobble/zenith-text-wobble.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {LeaderboardService} from '../../services/network/leaderboard.service';
import {NumberUtils} from '../../util/NumberUtils';
import {UserSessionService} from '../../services/user-session.service';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';

@Component({
  selector: 'app-home',
  imports: [
    ChallengeComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    RouterLink,
    NgOptimizedImage,
    NgClass,
    MatTooltip,
    ZenithTextWobbleComponent,
    MatTabGroup,
    MatTab,
    AsyncPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit, OnDestroy {
  public user$: Observable<UserProfileData | null>;

  private numberUtils: NumberUtils = new NumberUtils();

  private timerId: any;
  private contributionTimerId: any;
  protected readonly Difficulty = Difficulty;

  isAutoTracking: boolean = false;

  dailyChallenges: DailyChallenge[] = [];
  date: string = "";
  runsUntilUnixSeconds: number = 0;
  communityChallengeEndDateUnixSeconds: number = 0;
  leaderboardChallengeEndDateUnixSeconds: number = 0;

  globalLeaderboardData: GlobalLeaderboard | undefined;
  globalLeaderboardColumns: string[] = ['Username', 'Score', 'EasyChallengesCompleted', 'NormalChallengesCompleted', 'HardChallengesCompleted', 'ExpertChallengesCompleted', 'ReverseChallengesCompleted', 'MasteryChallengesCompleted'];

  seasonalLeaderboardData : SeasonalLeaderboard | undefined;
  seasonalLeaderboardColumns: string[] = ['Username', 'Score'];

  legacyLeaderboardData : any | undefined;
  legacyLeaderboardColumns: string[] = ['Username', 'Score'];

  communityChallengeData: CommunityChallenge | undefined;

  nextSubmissionPossibleUnixSeconds: number = 0;
  timeLeft: string = "";
  communityTimeLeft: string = "";
  leaderboardTimeLeft: string = "";
  autoUpdateTimeLeft: string = "0M 0S";
  isCommunityChallengeFinished: string = "";

  recentContributions: RecentCommunityContribution[] = [];
  todayUsersCompletions: TodayCompletions | undefined;

  serverStatistics: ServerStatistics | undefined;

  constructor(
    private zenithService: ZenithService,
    private leaderboardService: LeaderboardService,
    private authService: AuthService,
    private userService: ZenithUserService,
    private cookieHelper: CookieHelper,
    private ngZone: NgZone,
    private settingsService: SettingsService,
    private readonly session: UserSessionService)
  {
      this.user$ = this.session.user$;
  }

  ngOnInit(): void {
    this.loadUsersTodaysCompletions();

    this.zenithService.getDailyChallenges().subscribe(result => {
      this.dailyChallenges = result;
    })

    this.zenithService.getCommunityChallenge().subscribe(result => {
      this.communityChallengeData = result;
      this.communityChallengeEndDateUnixSeconds = result.endsAtUnixSeconds;
    })

    this.leaderboardService.getLeaderboard().subscribe(result => {
      this.seasonalLeaderboardData = result;
      this.leaderboardChallengeEndDateUnixSeconds = result.endsAtUnixSeconds;
    })

    this.leaderboardService.getGlobalLeaderboard().subscribe(result => {
      this.globalLeaderboardData = result;
    })

    this.leaderboardService.getLegacyLeaderboard().subscribe(result => {
      this.legacyLeaderboardData = result;
    })

    this.zenithService.getServerStatistics().subscribe(result => {
      this.serverStatistics = result;
    })

    this.zenithService.getDates().subscribe(result => {
      this.date = result.dateString;
      this.runsUntilUnixSeconds = result.runsUntilUnixSeconds;

      this.ngZone.runOutsideAngular(() => {
        this.timerId = interval(1000).subscribe(() => {
          this.ngZone.run(() => {
            this.updateTimeLeft();
            this.updateCommunityTimeLeft();
            this.updateLeaderboardTimeLeft();
            this.updateAutoUpdateTimer();
          });
        });
      });
    })

    this.updateCommunityGoal();

    this.ngZone.runOutsideAngular(() => {
      this.contributionTimerId = interval(10000).subscribe(() => {
        this.ngZone.run(() => {
          this.updateCommunityGoal();
        });
      });
    });

    this.settingsService.autoUpdate$.subscribe(x => {
      this.isAutoTracking = x
    });
  }

  private async loadUsersTodaysCompletions() {
    const user = await firstValueFrom(this.user$.pipe(take(1)));

    if(user){
      this.userService.getTodaysChallengeCompletions(user.username).subscribe(result => {
        this.todayUsersCompletions = result;
      })
    }
  }

  private unixSecondsToString(unixSeconds: number): [number, number, number, number]{
    const days = Math.floor(unixSeconds / (1000 * 60 * 60 * 24));
    const seconds = Math.floor((unixSeconds / 1000) % 60);
    const minutes = Math.floor((unixSeconds / (1000 * 60)) % 60);
    const hours = Math.floor((unixSeconds / (1000 * 60 * 60)) % 24);

    return [days, hours, minutes, seconds];
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

    let timeTuple = this.unixSecondsToString(timeDifference);

    this.communityTimeLeft = `${timeTuple[0]}d ${timeTuple[1]}h ${timeTuple[2]}m ${timeTuple[3]}s`;
  }

  private updateLeaderboardTimeLeft(){
    if(this.leaderboardChallengeEndDateUnixSeconds == 0) return;

    if(this.leaderboardChallengeEndDateUnixSeconds == -1){
      this.leaderboardTimeLeft = "♾️ time"
      return;
    }

    const currentDate = new Date();
    const targetDate = new Date(this.leaderboardChallengeEndDateUnixSeconds * 1000);

    const timeDifference = targetDate.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      this.leaderboardTimeLeft = "Time's up!";
      return;
    }

    let timeTuple = this.unixSecondsToString(timeDifference);

    this.leaderboardTimeLeft = `${timeTuple[0]}d ${timeTuple[1]}h ${timeTuple[2]}m ${timeTuple[3]}s`;
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

    let timeTuple = this.unixSecondsToString(timeDifference);

    this.timeLeft = `${timeTuple[1]}h ${timeTuple[2]}m ${timeTuple[3]}s`;
  }

  private lastUpdateSeconds = 0;

  private updateAutoUpdateTimer() {
    if (!this.isAutoTracking) return;

    let currentTime = new Date();

    if (this.lastUpdateSeconds == 0){
      this.lastUpdateSeconds = currentTime.getTime() / 1000;
      return;
    }

    const targetTime = new Date( (this.lastUpdateSeconds + 120) * 1000);

    const timeDifference = targetTime.getTime() - currentTime.getTime();

    let timeTuple = this.unixSecondsToString(timeDifference);

    this.autoUpdateTimeLeft = `${timeTuple[2]}m ${timeTuple[3]}s`;

    if (timeTuple[2] == 0 && timeTuple[3] == 0) {
      console.log('submitting runs', timeTuple)

      this.submitRuns();
    }
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

  ngOnDestroy(): void {
    if (this.timerId) {
      this.timerId.unsubscribe();
    }

    if (this.contributionTimerId) {
      this.contributionTimerId.unsubscribe();
    }
  }

  submitRuns() {
    this.zenithService.submitRuns().subscribe({
      next: (r) => {
        // Do nothing
        this.lastUpdateSeconds = new Date().getTime() / 1000;

        // after successfull submission, we update the users data
        this.loadUsersTodaysCompletions();
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

  getCommunityGoalPercentage(currentValue: number, target: number) {
    console.log(`${Math.round((currentValue / target) * 100)}%`)

    return `${Math.round((currentValue / target) * 100)}%`;
  }

  protected getLevelTagShape(level: number) {
    const parts = this.numberUtils.splitInto4PlaceValues(level)

    let x = parts[1] >= 500 ? parts[1] - 500 : parts[1];

    return "lt_shape_" + Math.floor(x/ 100);
  }

  protected getLevelTagBadgeColor(level: number) {
    const parts = this.numberUtils.splitInto4PlaceValues(level)
    const combinedParts = parts[0] + parts[1];

    return "lt_badge_color_" + Math.floor(combinedParts / 500);
  }

  protected getLevelTagShapeColor(level: number) {
    const parts = this.numberUtils.splitInto4PlaceValues(level)
    const combinedParts = parts[2] + parts[3];


    return "lt_shape_color_" + Math.floor(combinedParts / 10);
  }
}
