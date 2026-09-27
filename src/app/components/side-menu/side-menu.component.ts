import {Component, Input, OnInit, ChangeDetectionStrategy, inject, signal, computed, effect} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {CookieHelper} from '../../util/CookieHelper';
import {NumberUtils} from '../../util/NumberUtils';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {MatDrawer} from '@angular/material/sidenav';
import {TodayCompletions} from '../../services/network/data/interfaces/TodayCompletions';
import {LeaderboardService} from '../../services/network/leaderboard.service';
import {map, Observable} from 'rxjs';
import {ZdcSessionService} from '../../services/zdc-session.service';
import {AsyncPipe} from '@angular/common';
import {ZenithService} from '../../services/network/zenith.service';
import {MatRipple} from '@angular/material/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';

@Component({
  selector: 'app-side-menu',
  imports: [
    MatIcon,
    RouterLink,
    AsyncPipe,
    MatRipple
  ],
  templateUrl: './side-menu.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent implements OnInit{
  @Input() drawer!: MatDrawer;

  private readonly session = inject(ZdcSessionService);
  private readonly userService = inject(ZenithUserService);
  private readonly zenithService = inject(ZenithService);
  private readonly leaderboardService = inject(LeaderboardService);
  private readonly cookieHelper = inject(CookieHelper);
  private readonly router = inject(Router);

  user$: Observable<UserProfileData | null>;
  challengeCompletions$: Observable<TodayCompletions | null>;

  username = signal<string | null>(null)

  // todayUsersCompletions: TodayCompletions | undefined;
  challengeCompletions = rxResource({
    stream: () => this.challengeCompletions$.pipe(map(res => res as TodayCompletions))
  })

  leaderboard = rxResource({
    params: () => ({
      username: this.username()
    }),
    stream: ({ params }: { params: { username: string | null } }) => {
      if (!params.username) {
        throw new Error('Username is required');
      }
      return this.leaderboardService.getLeaderboardPosition(params.username);
    },
  });

  seasonPlacement = signal<number>(-1)
  seasonName = signal<string>("")

  constructor()
  {
    this.user$ = this.session.user$;
    this.challengeCompletions$ = this.session.challengeCompletions$;

    effect(() => {
      const leaderboard = this.leaderboard.value();

      if(!leaderboard) return;
      this.seasonPlacement.set(leaderboard.placement);
      this.seasonName.set(leaderboard.seasonName);
    });
  }

  ngOnInit() {
    this.username.set(this.cookieHelper.getCookieByName('username'));
  }

  protected getCompletionCss(completed: boolean | undefined)
  {
    return completed ? '' : 'challengeUncompleted';
  }

  protected search(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      return;
    }

    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (!value) {
      return;
    }

    this.router.navigate(['/u', value]);

    input.value = '';
  }

  protected readonly NumberUtils = NumberUtils;

  protected submit() {
    this.session.submitAndUpdate();
  }

  protected onImageError(event: ErrorEvent) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }
}
