import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {filter} from 'rxjs';
import {environment} from '../environments/environment';
import {UserProfileData} from './services/network/data/interfaces/UserProfileData';
import {CookieHelper} from './util/CookieHelper';
import {AuthService} from './services/network/auth.service';
import {UserSessionService} from './services/user-session.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MatDrawerContainer, MatDrawer, SideMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  @ViewChild('drawer') drawer!: MatDrawer;

  title = 'Zenith DailyChallenge Web';
  isLocal = false;

  public userProfileData: UserProfileData | undefined;
  public isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private readonly session: UserSessionService,
    private cookieHelper: CookieHelper,
    private authApi: AuthService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.drawer.close();
      });

    this.isLocal = !environment.production;
  }

  onDrawerToggle(opened: boolean) {
    document.body.style.overflow = opened ? 'hidden' : '';
  }

  ngOnInit() {
    let username = this.cookieHelper.getCookieByName('username');

    this.authApi.isUserAuthorized().subscribe({
      next: (result: any) => {
         if(result != null){
           this.session.setUser(result);
        }
      },
      error: (e: any) => {
        this.session.setUser(null);
      }
    })
  }

  protected readonly environment = environment;
}
