import {Component, Input, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {CookieHelper} from '../../util/CookieHelper';
import {NumberUtils} from '../../util/NumberUtils';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {MatDrawer} from '@angular/material/sidenav';
import {TodayCompletions} from '../../services/network/data/interfaces/TodayCompletions';
import {LeaderboardService} from '../../services/network/leaderboard.service';
import {Observable} from 'rxjs';
import {ZdcSessionService} from '../../services/zdc-session.service';
import {AsyncPipe} from '@angular/common';
import {ZenithService} from '../../services/network/zenith.service';

@Component({
  selector: 'app-side-menu',
  imports: [
    MatIcon,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent implements OnInit{
  @Input() drawer!: MatDrawer;
  @Input() completions: TodayCompletions | undefined;

  user$: Observable<UserProfileData | null>;
  challengeCompletions$: Observable<TodayCompletions | null>;

  // todayUsersCompletions: TodayCompletions | undefined;
  seasonPlacement: number = -1;
  seasonName: string = "";

  constructor(
    private readonly session: ZdcSessionService,
    private userService: ZenithUserService,
    private zenithService: ZenithService,
    private leaderboardService: LeaderboardService,
    private cookieHelper: CookieHelper,
    private readonly router: Router
    )
  {
    this.user$ = this.session.user$;
    this.challengeCompletions$ = this.session.challengeCompletions$;
  }

  ngOnInit() {
    this.challengeCompletions$.subscribe(result => {
      if(!result) return;

      this.completions = result;
    })

    this.loadSeasonPlacement();
  }

  private loadSeasonPlacement() {
    let username = this.cookieHelper.getCookieByName('username');

    this.leaderboardService.getLeaderboardPosition(username).subscribe(result => {
      this.seasonPlacement = result.placement;
      this.seasonName = result.seasonName;
    })
  }

  // private loadUsersTodaysCompletions() {
  //   let username = this.cookieHelper.getCookieByName('username');
  //
  //   this.userService.getTodaysChallengeCompletions(username).subscribe(result => {
  //     this.todayUsersCompletions = result;
  //   });
  // }

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
}
