import {Component, OnInit} from '@angular/core';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {Run} from '../../services/network/data/interfaces/Run';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {DailyHelper} from '../../util/DailyHelper';

@Component({
  selector: 'app-runs',
  imports: [
    DatePipe,
    MatIcon,
    RouterLink
  ],
  templateUrl: './runs.component.html',
  styleUrl: './runs.component.scss'
})
export class RunsComponent implements OnInit{
  username!: string;
  currentPage: number = 0;
  runs: Run[] = []

  protected readonly DailyHelper = DailyHelper;

  constructor(private route: ActivatedRoute, private userService: ZenithUserService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;
      this.loadMoreRuns();
    });
  }

  loadMoreRuns(){
    this.userService.getRuns(this.username, this.currentPage, 100).subscribe(runs => {
      this.runs = [...this.runs, ...runs];
      this.currentPage++;
    });
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
