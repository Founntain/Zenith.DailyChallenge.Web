import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {filter, Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {UserProfileData} from './services/network/data/interfaces/UserProfileData';
import {CookieHelper} from './util/CookieHelper';
import {AuthService} from './services/network/auth.service';
import {ZdcSessionService} from './services/zdc-session.service';
import {MatIcon} from '@angular/material/icon';
import {DailyChallenge} from './services/network/data/interfaces/DailyChallenge';
import {CommunityChallenge} from './services/network/data/interfaces/CommunityChallenge';
import {TodayCompletions} from './services/network/data/interfaces/TodayCompletions';
import {ZenithService} from './services/network/zenith.service';
import {ZenithUserService} from './services/network/zenith-user.service';
import {WeeklyChallenge} from './services/network/data/interfaces/WeeklyChallenge';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MatDrawerContainer, MatDrawer, SideMenuComponent, MatIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  @ViewChild('drawer') drawer!: MatDrawer;

  title = 'Zenith DailyChallenge Web';
  isLocal = false;

  public isLoggedIn: boolean = false;
  public user$: Observable<UserProfileData | null>;

  constructor(
    private router: Router,
    private readonly session: ZdcSessionService,
    private cookieHelper: CookieHelper,
    private authApi: AuthService,
    private zenithService: ZenithService,
    private userService: ZenithUserService,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.drawer.close();
      });

    this.isLocal = !environment.production;
    this.user$ = this.session.user$;
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
    });

    this.loadDailyChallenges();
    this.loadWeeklyChallenge();
    this.loadCommunityChallenge();
    this.loadUserCompletions();
  }

  private loadDailyChallenges() {
    this.zenithService.getDailyChallenges().subscribe({
      next: (result: DailyChallenge[]) => {
        if(result != null){
          this.session.setDailyChallenge(result);
        }
      },
      error: (e: any) => {
        console.error('Error loading daily challenges:', e);
      }
    });
  }

  private loadWeeklyChallenge() {
    this.zenithService.getWeekly().subscribe({
      next: (result: WeeklyChallenge) => {
        if(result != null){
          this.session.setWeeklyChallenge(result);
        }
      },
      error: (e: any) => {
        console.error('Error loading daily challenges:', e);
      }
    });
  }

  private loadCommunityChallenge(){
    this.zenithService.getCommunityChallenge().subscribe({
      next: (result: CommunityChallenge) => {
        if(result != null){
          this.session.setCommunityChallenge(result);
        }
      },
      error: (e: any) => {
        console.error('Error loading community challenge:', e);
      }
    });
  }

  private loadUserCompletions(){
    this.user$.subscribe(user => {
      if(user) {
        this.userService.getTodaysChallengeCompletions(user.username).subscribe({
          next: (result) => {
            if(result != null){
              this.session.setChallengeCompletions(result);
            }
          },
          error: (e: any) => {
            console.error('Error loading user completions:', e);
          }
        });

        this.zenithService.getWeeklyProgression(user.username).subscribe({
          next: (result) => {
            if(result != null){
              this.session.setWeeklyProgression(result);
            }
          },
          error: (e: any) => {
            console.error('Error loading user completions:', e);
          }
        });
      }
    });
  }

  protected readonly environment = environment;
}
