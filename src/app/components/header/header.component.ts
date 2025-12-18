import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {CookieHelper} from '../../util/CookieHelper';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/network/auth.service';
import {MatIcon} from '@angular/material/icon';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatIcon
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  @Input() drawer!: MatDrawer;

  userProfileData: UserProfileData | undefined;
  isLoggedIn: boolean = false;

  constructor(private userApi: ZenithUserService, private authApi: AuthService, private cookieHelper: CookieHelper) {
  }

  loginClick(){
    const { protocol, hostname, port } = window.location;
    const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;

    let url = `https://discord.com/oauth2/authorize?client_id=1332751405374505154&response_type=code&redirect_uri=${encodeURIComponent(environment.apiUrl+"/auth/discord")}&scope=identify&state=${encodeURIComponent(baseUrl)}`;

    window.location.assign(url)
  }

  ngOnInit() {
    let username = this.cookieHelper.getCookieByName('username');

    this.authApi.isUserAuthorized().subscribe({
      next: (result) => {
        this.userProfileData = result;

        if(this.userProfileData != null){
          this.isLoggedIn = true;
        }
      },
      error: (e) => {
        this.isLoggedIn = false;
      }
    })
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
