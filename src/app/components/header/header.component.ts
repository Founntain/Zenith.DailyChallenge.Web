import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {CookieHelper} from '../../util/CookieHelper';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {AsyncPipe, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/network/auth.service';
import {MatIcon} from '@angular/material/icon';
import {MatDrawer} from '@angular/material/sidenav';
import {ZdcSessionService} from '../../services/zdc-session.service';
import {Observable} from 'rxjs';
import {DailyHelper} from '../../util/DailyHelper';
import {CommunityChallenge} from '../../services/network/data/interfaces/CommunityChallenge';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatIcon,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  @Input() drawer!: MatDrawer;

  user$: Observable<UserProfileData | null>;
  communityChallenge$: Observable<CommunityChallenge | null>;

  communityCss: string = '';

  constructor(
    private readonly session: ZdcSessionService,
    private userApi: ZenithUserService,
    private authApi: AuthService,
    private cookieHelper: CookieHelper)
  {
      this.user$ = this.session.user$;
      this.communityChallenge$ = this.session.communityChallenge$;
  }

  loginClick(){
    DailyHelper.signIn();
  }

  ngOnInit() {
    this.communityChallenge$.subscribe(result => {
      if(!result?.communityChallenge) {
        this.communityCss = '';
        return;
      }

      this.communityCss = 'event-running';
    });
  }

  logout() {
    this.authApi.logout().subscribe({
      next: (result) => {
        window.location.reload();
      },
      error: (e) => {
        alert('An error occurred while logging out. Please try again later. Error: ' + e);
      }
    })
  }
}
