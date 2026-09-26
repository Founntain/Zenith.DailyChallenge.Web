import {Component, OnInit, ChangeDetectionStrategy, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {map, Observable} from 'rxjs';
import {RouterLink} from '@angular/router';
import {CommunityChallenge} from '../../services/network/data/interfaces/CommunityChallenge';
import {LeaderboardService} from '../../services/network/leaderboard.service';
import {ZdcSessionService} from '../../services/zdc-session.service';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {MatIcon} from '@angular/material/icon';
import {ZdcStatsComponent} from '../../components/zdc-stats/zdc-stats.component';
import {DailyHelper} from '../../util/DailyHelper';
import {ChallengesNewComponent} from '../../components/challenges-new/challenges-new.component';
import {ChallengeHelper} from '../../util/ChallengeHelper';
import {MatRipple} from '@angular/material/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {SeasonalLeaderboard} from '../../services/network/data/interfaces/GlobalLeaderboard';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    ZdcStatsComponent,
    ChallengesNewComponent,
    ChallengesNewComponent,
    AsyncPipe,
    MatIcon,
    MatRipple
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  protected readonly DailyHelper = DailyHelper;

  public communityChallenge$: Observable<CommunityChallenge | null>;

  seasonalInfo = rxResource({
    stream: () => {
      return this.leaderboardService.getLeaderboardInfo().pipe(map(res => res as any | undefined));
    },
  });

  protected readonly ChallengeHelper = ChallengeHelper;
  private readonly leaderboardService = inject(LeaderboardService);
  private readonly session = inject(ZdcSessionService);

  constructor()
  {
      this.communityChallenge$ = this.session.communityChallenge$;
  }
}
