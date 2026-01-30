import {Component, Input, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {CookieHelper} from '../../util/CookieHelper';
import {NumberUtils} from '../../util/NumberUtils';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {AuthService} from '../../services/network/auth.service';
import {MatDrawer} from '@angular/material/sidenav';
import {TodayCompletions} from '../../services/network/data/interfaces/TodayCompletions';
import {LeaderboardService} from '../../services/network/leaderboard.service';
import {Observable} from 'rxjs';
import {UserSessionService} from '../../services/user-session.service';
import {AsyncPipe} from '@angular/common';

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

  user$: Observable<UserProfileData | null>;

  public numberHelper: NumberUtils = new NumberUtils();

  todayUsersCompletions: TodayCompletions | undefined;
  seasonPlacement: number = -1;
  seasonName: string = "";

  constructor(
    private readonly session: UserSessionService,
    private userService: ZenithUserService,
    private leaderboardService: LeaderboardService,
    private cookieHelper: CookieHelper,
    )
  {
    this.user$ = this.session.user$;
  }

  ngOnInit() {

  }

  private loadSeasonPlacement() {
    let username = this.cookieHelper.getCookieByName('username');

    this.leaderboardService.getLeaderboardPosition(username).subscribe(result => {
      this.seasonPlacement = result.placement;
      this.seasonName = result.seasonName;
    })
  }

  private loadUsersTodaysCompletions() {
    let username = this.cookieHelper.getCookieByName('username');

    this.userService.getTodaysChallengeCompletions(username).subscribe(result => {
      this.todayUsersCompletions = result;
    });
  }

  protected getCompletionCss(completed: boolean | undefined)
  {
    return completed ? '' : 'challengeUncompleted';
  }


}
