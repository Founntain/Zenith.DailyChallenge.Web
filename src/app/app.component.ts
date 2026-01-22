import {Component, ViewChild} from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {MatDrawer, MatDrawerContainer} from '@angular/material/sidenav';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {filter} from 'rxjs';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MatDrawerContainer, MatDrawer, SideMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('drawer') drawer!: MatDrawer;

  title = 'Zenith DailyChallenge Web';
  isLocal = false;

  constructor(private router: Router) {
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

  protected readonly environment = environment;
}
