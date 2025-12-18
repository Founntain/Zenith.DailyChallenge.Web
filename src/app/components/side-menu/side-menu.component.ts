import {Component, Input, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {CookieHelper} from '../../util/CookieHelper';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {AuthService} from '../../services/network/auth.service';
import {MatDrawer} from '@angular/material/sidenav';
import {TodayCompletions} from '../../services/network/data/interfaces/TodayCompletions';

@Component({
  selector: 'app-side-menu',
  imports: [
    MatIcon,
    RouterLink
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent implements OnInit{
  @Input() drawer!: MatDrawer;

  userProfileData: UserProfileData | undefined;
  isLoggedIn: boolean = false;

  todayUsersCompletions: TodayCompletions | undefined;

  constructor(
    private userApi: ZenithUserService,
    private userService: ZenithUserService,
    private authApi: AuthService,
    private cookieHelper: CookieHelper,
    private authService: AuthService) {
  }

  ngOnInit() {
    let username = this.cookieHelper.getCookieByName('username');

    this.authApi.isUserAuthorized().subscribe({
      next: (result) => {
        this.userProfileData = result;

        if(this.userProfileData != null){
          this.isLoggedIn = true;

          this.loadUsersTodaysCompletions()
        }
      },
      error: (e) => {
        this.isLoggedIn = false;
      }
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
