import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {CookieHelper} from '../../util/CookieHelper';
import {UserService} from '../../services/network/user.service';
import {UserProfileData} from '../../services/network/data/interfaces/UserProfileData';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/network/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  userProfileData: UserProfileData | undefined;
  isLoggedIn: boolean = false;

  constructor(private userApi: UserService, private authApi: AuthService, private cookieHelper: CookieHelper) {
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
}
