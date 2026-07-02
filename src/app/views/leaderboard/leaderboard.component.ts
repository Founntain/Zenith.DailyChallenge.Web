import {Component, OnInit} from '@angular/core';
import {GlobalLeaderboard, SeasonalLeaderboard} from '../../services/network/data/interfaces/GlobalLeaderboard';
import {LeaderboardService} from '../../services/network/leaderboard.service';
import {DailyHelper} from '../../util/DailyHelper';
import {RouterLink} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-leaderboard',
  imports: [
    RouterLink,
    MatTooltip,
  ],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  protected readonly DailyHelper = DailyHelper;

  activeView: string = 'seasonal';

  constructor(private leaderboardService: LeaderboardService) {

  }

  activeLeaderboard: SeasonalLeaderboard | undefined = undefined;

  ngOnInit() {
    this.activeView = 'seasonal';

    this.loadLeaderboard(this.activeView);
  }

  setViewActive(view: string){
    this.activeView = view;

    this.loadLeaderboard(view);
  }

  protected isActiveView(view: string) {
    return this.activeView === view ? 'active' : '';
  }

  onImageError(event: ErrorEvent) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  private loadLeaderboard(view: string) {
    switch (view){
      case 'seasonal':
        console.log('seasonal leaderboard');
        this.leaderboardService.getLeaderboard().subscribe(result => {
          this.activeLeaderboard = result;
        })
        break;
      case 'all-time':
        console.log('all-time leaderboard');
        this.leaderboardService.getGlobalLeaderboard().subscribe(result => {
          this.activeLeaderboard = result as any;
        })
        break;
      case 'legacy':
        console.log('legacy leaderboard');
        this.leaderboardService.getLegacyLeaderboard().subscribe(result => {
          this.activeLeaderboard = result as any;
        })
        break;
    }
  }
}
