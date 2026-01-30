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
import {UserSessionService} from '../../services/user-session.service';
import {Observable} from 'rxjs';

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

  constructor(
    private readonly session: UserSessionService,
    private userApi: ZenithUserService,
    private authApi: AuthService,
    private cookieHelper: CookieHelper)
  {
      this.user$ = this.session.user$;
  }

  loginClick(){
    const { protocol, hostname, port } = window.location;
    const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;

    let url = `https://discord.com/oauth2/authorize?client_id=1332751405374505154&response_type=code&redirect_uri=${encodeURIComponent(environment.apiUrl+"/auth/discord")}&scope=identify&state=${encodeURIComponent(baseUrl)}`;

    window.location.assign(url)
  }

  ngOnInit() {

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
