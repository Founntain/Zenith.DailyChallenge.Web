import {Component, NgZone, OnInit} from '@angular/core';
import {GlobalLeaderboard, SeasonalLeaderboard} from '../../services/network/data/interfaces/GlobalLeaderboard';
import {LeaderboardService} from '../../services/network/leaderboard.service';
import {DailyHelper} from '../../util/DailyHelper';
import {RouterLink} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {TimeHelper} from '../../util/TimeHelper';
import {interval} from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  imports: [
    RouterLink,
    MatTooltip,
    MatIcon,
  ],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  protected readonly DailyHelper = DailyHelper;

  activeView: string = 'seasonal';

  seasonalTimeLeft: string = 'fetching time left...';
  seasonalEndDateUnixSeconds: number = 0;

  private timerId: any;

  constructor(private leaderboardService: LeaderboardService, private ngZone: NgZone) {

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

          this.ngZone.runOutsideAngular(() => {
            this.timerId = interval(1000).subscribe(() => {
              this.ngZone.run(() => {
                this.updateLeaderboardTimeLeft();
              });
            });
          });
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

  private updateLeaderboardTimeLeft(){
    if(this.activeLeaderboard?.endsAtUnixSeconds == 0) return;

    if(this.activeLeaderboard?.endsAtUnixSeconds == -1){
      this.seasonalTimeLeft = "♾️ time"
      return;
    }

    if(this.activeLeaderboard?.endsAtUnixSeconds == null) {
      this.seasonalTimeLeft = "fetching time left..."
      return;
    }

    const currentDate = new Date();
    const targetDate = new Date(this.activeLeaderboard.endsAtUnixSeconds * 1000);

    const timeDifference = targetDate.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      this.seasonalTimeLeft = "Time's up!";
      return;
    }

    let timeTuple = TimeHelper.unixSecondsToString(timeDifference);

    console.log(timeTuple)

    this.seasonalTimeLeft = `${timeTuple[0]}d ${timeTuple[1]}h ${timeTuple[2]}m ${timeTuple[3]}s`;
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      this.timerId.unsubscribe();
    }
  }
}
