import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ZenithService} from '../../services/network/zenith.service';
import {ChallengeComponent} from '../../components/challenge/challenge.component';
import {AsyncPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {interval, Observable, take} from 'rxjs';
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
import {SettingsService} from '../../services/settings.service';
import {ServerStatistics} from '../../services/network/data/interfaces/ServerStatistics';
import {MatTooltip} from '@angular/material/tooltip';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {LeaderboardService} from '../../services/network/leaderboard.service';
import {NumberUtils} from '../../util/NumberUtils';
import {ZdcSessionService} from '../../services/zdc-session.service';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {MatIcon} from '@angular/material/icon';
import {ChallengesComponent} from '../../components/challenges/challenges.component';
import {TimeHelper} from '../../util/TimeHelper';
import {CommunityChallengeComponent} from '../../components/community-challenge/community-challenge.component';
import {ZdcStatsComponent} from '../../components/zdc-stats/zdc-stats.component';
import {DailyHelper} from '../../util/DailyHelper';
import {ChallengesNewComponent} from '../../components/challenges-new/challenges-new.component';
import {ChallengeHelper} from '../../util/ChallengeHelper';

@Component({
  selector: 'app-home',
  imports: [
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
    MatTooltip,
    MatTabGroup,
    MatTab,
    ChallengesComponent,
    CommunityChallengeComponent,
    ZdcStatsComponent,
    ChallengesNewComponent,
    ChallengesNewComponent,
    AsyncPipe,
    MatIcon
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit, OnDestroy {
  protected readonly DailyHelper = DailyHelper;

  public user$: Observable<UserProfileData | null>;
  public communityChallenge$: Observable<CommunityChallenge | null>;

  @ViewChild(ChallengesComponent)
  private challengesComponent?: ChallengesComponent;

  private timerId: any;

  protected readonly Difficulty = Difficulty;

  leaderboardChallengeEndDateUnixSeconds: number = 0;

  globalLeaderboardData: GlobalLeaderboard | undefined;
  globalLeaderboardColumns: string[] = ['Username', 'Score', 'EasyChallengesCompleted', 'NormalChallengesCompleted', 'HardChallengesCompleted', 'ExpertChallengesCompleted', 'ReverseChallengesCompleted', 'MasteryChallengesCompleted'];

  seasonalLeaderboardData : SeasonalLeaderboard | undefined;
  seasonalLeaderboardColumns: string[] = ['Username', 'Score'];

  legacyLeaderboardData : any | undefined;
  legacyLeaderboardColumns: string[] = ['Username', 'Score'];

  nextSubmissionPossibleUnixSeconds: number = 0;

  leaderboardTimeLeft: string = "";

  protected readonly ChallengeHelper = ChallengeHelper;

  constructor(
    private zenithService: ZenithService,
    private leaderboardService: LeaderboardService,
    private ngZone: NgZone,
    private readonly session: ZdcSessionService)
  {
      this.user$ = this.session.user$;
      this.communityChallenge$ = this.session.communityChallenge$;
  }

  ngOnInit(): void {
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

    this.zenithService.getDates().subscribe(result => {
      this.ngZone.runOutsideAngular(() => {
        this.timerId = interval(1000).subscribe(() => {
          this.ngZone.run(() => {
            this.updateLeaderboardTimeLeft();
          });
        });
      });
    })
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

    let timeTuple = TimeHelper.unixSecondsToString(timeDifference);

    this.leaderboardTimeLeft = `${timeTuple[0]}d ${timeTuple[1]}h ${timeTuple[2]}m ${timeTuple[3]}s`;
  }

  private lastUpdateSeconds = 0;

  ngOnDestroy(): void {
    if (this.timerId) {
      this.timerId.unsubscribe();
    }
  }
}
