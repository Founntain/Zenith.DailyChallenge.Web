import {Component, NgZone, OnInit, ChangeDetectionStrategy, inject, signal, ResourceRef, effect} from '@angular/core';
import {GlobalLeaderboard, SeasonalLeaderboard} from '../../services/network/data/interfaces/GlobalLeaderboard';
import {LeaderboardService} from '../../services/network/leaderboard.service';
import {DailyHelper} from '../../util/DailyHelper';
import {RouterLink} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {TimeHelper} from '../../util/TimeHelper';
import {interval, map, Observable} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {ChartHelper} from '../../util/ChartHelper';

@Component({
  selector: 'app-leaderboard',
  imports: [
    RouterLink,
    MatTooltip,
    MatIcon,
  ],
  templateUrl: './leaderboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  private readonly leaderboardService = inject(LeaderboardService);
  private readonly ngZone = inject(NgZone);

  protected readonly DailyHelper = DailyHelper;
  protected activeView = signal<string>('seasonal');
  protected seasonalTimeLeft: string = 'fetching time left...';

  private timerId: any;

  activeLeaderboard = rxResource({
    params: () => ({ view: this.activeView() }),
    stream: ({ params }: { params: { view: string } }): Observable<SeasonalLeaderboard | undefined> => {
      console.log('stream!', params.view);

      switch (params.view){
        case 'seasonal':
          console.log('seasonal leaderboard');
          return this.leaderboardService.getLeaderboard();
        case 'all-time':
          console.log('all-time leaderboard');
          return this.leaderboardService.getGlobalLeaderboard().pipe(
            map(res => res as unknown as SeasonalLeaderboard)
          );
        case 'legacy':
          console.log('legacy leaderboard');
          return this.leaderboardService.getLegacyLeaderboard().pipe(
            map(res => res as unknown as SeasonalLeaderboard)
          );
        default:
          return new Observable<SeasonalLeaderboard | undefined>(observer => {
            observer.next(undefined);
            observer.complete();
          });
      }
    },
    defaultValue: undefined
  });

  ngOnInit() {
    this.activeView.set('seasonal');

    this.ngZone.runOutsideAngular(() => {
    this.timerId = interval(1000).subscribe(() => {
      this.ngZone.run(() => {
        this.updateLeaderboardTimeLeft();
      });
    });
  });
  }

  setViewActive(view: string){
    this.activeView.set(view);
  }

  protected isActiveView(view: string) {
    return this.activeView() === view ? 'active' : '';
  }

  onImageError(event: ErrorEvent) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }


  private updateLeaderboardTimeLeft(){

    let activeLeaderboard = this.activeLeaderboard.value();

    if(activeLeaderboard?.endsAtUnixSeconds == 0) return;

    if(activeLeaderboard?.endsAtUnixSeconds == -1){
      this.seasonalTimeLeft = "♾️ time"
      return;
    }

    if(activeLeaderboard?.endsAtUnixSeconds == null) {
      this.seasonalTimeLeft = "fetching time left..."
      return;
    }

    const currentDate = new Date();
    const targetDate = new Date(activeLeaderboard.endsAtUnixSeconds * 1000);

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
