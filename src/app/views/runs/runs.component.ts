import {Component, OnInit, ChangeDetectionStrategy, inject, signal, effect} from '@angular/core';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {Run} from '../../services/network/data/interfaces/Run';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {DailyHelper} from '../../util/DailyHelper';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {DailyDataNew} from '../../services/network/data/interfaces/DailyData';

@Component({
  selector: 'app-runs',
  imports: [
    DatePipe,
    MatIcon,
    RouterLink
  ],
  templateUrl: './runs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './runs.component.scss'
})
export class RunsComponent implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(ZenithUserService);

  protected readonly DailyHelper = DailyHelper;

  username = signal<string>('');
  currentPage = signal<number>(0);
  runs = signal<Run[]>([]);

  currentPageRuns = rxResource({
    params: () => ({ username: this.username(), currentPage: this.currentPage() }),
    stream: ({ params }: { params: { username: string | null, currentPage: number } }) => {
      if (!params.username) {
        throw new Error('Username is required');
      }
      return this.userService.getRuns(params.username, params.currentPage, 100).pipe(map(res => res as Run[]));
    },
  });

  constructor() {
    effect(() => {
      const newRuns = this.currentPageRuns.value();
      if (newRuns && newRuns.length > 0) {
        if (this.currentPage() === 0) {
          // Reset for first page
          this.runs.set(newRuns);
        } else {
          // Append for subsequent pages
          this.runs.update(existing => [...existing, ...newRuns]);
        }
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username.set(params.get('username')!);
    });
  }

  loadMoreRuns(){
    this.currentPage.update(page => page + 1);
  }

  roundNumber(value: number | undefined, decimalPoints: number = 2)
  {
    if(value === undefined || value === null) return 0;

    return DailyHelper.roundNumber(value, decimalPoints);
  }

  protected getFloorNameFromAltitude(altitude: number): string {
    return DailyHelper.getFloorLongName(DailyHelper.getFloorByAltitude(altitude));
  }

  protected getFloorKeyFromAltitude(altitude: number): string {
    return DailyHelper.getFloorKey(DailyHelper.getFloorByAltitude(altitude));
  }

  isSpeedrun(altitude: number, speedrun: boolean, speedrunSeen: boolean) {
    if (speedrun && altitude >= 1650) {
      return 'speedrun';
    }

    if (speedrunSeen || (speedrun && altitude < 1650)) {
      return 'speedrunSeen';
    }

    return ''
  }
}
