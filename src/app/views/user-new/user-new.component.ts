import {Component, OnInit} from '@angular/core';
import {ModHelper} from '../../util/ModHelper';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CookieHelper} from '../../util/CookieHelper';
import {MatIcon} from '@angular/material/icon';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {DailyDataNew, DailyDataNewExtra} from '../../services/network/data/interfaces/DailyData';
import {DatePipe, NgClass} from '@angular/common';
import {DailyHelper} from '../../util/DailyHelper';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration} from 'chart.js';
import {ChartHelper} from '../../util/ChartHelper';
import {BarSegmet, SegmentbarComponent} from '../../components/segmentbar/segmentbar.component';
import {Run} from '../../services/network/data/interfaces/Run';
import {ChallengeCompletion} from '../../services/network/data/interfaces/ChallengeCompletion';
import {ZenithSplitsComponent} from '../../components/zenith-splits/zenith-splits.component';

@Component({
  selector: 'app-user-new',
  imports: [
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    BaseChartDirective,
    SegmentbarComponent,
    DatePipe,
    ZenithSplitsComponent,
    RouterLink
  ],
  templateUrl: './user-new.component.html',
  styleUrl: './user-new.component.scss'
})
export class UserNewComponent implements OnInit{
  activeView: string = '';

  username!: string;
  isSameUser: boolean = false;

  public playStyleSegments: BarSegmet[] = [];
  dailyData: DailyDataNew | undefined;
  dailyDataExtra: DailyDataNewExtra | undefined;
  challengeCompletions: ChallengeCompletion[] = [];
  recentRuns: Run[] = [];

  floorChartData: ChartConfiguration['data'] | undefined;

  floorChartOptions: ChartConfiguration['options'] = ChartHelper.getFloorChartOptions()

  apmChartData: ChartConfiguration['data'] | undefined;
  apmChartOptions: ChartConfiguration['options'] = ChartHelper.getCleanLineChartOptions();

  vsChartData: ChartConfiguration['data'] | undefined;
  vsChartOptions: ChartConfiguration['options'] = ChartHelper.getCleanLineChartOptions();

  ppsChartData: ChartConfiguration['data'] | undefined;
  ppsChartOptions: ChartConfiguration['options'] = ChartHelper.getCleanLineChartOptions();

  altitudeChartData: ChartConfiguration['data'] | undefined;
  altitudeChartOptions: ChartConfiguration['options'] = ChartHelper.getCleanLineChartOptions();

  constructor( private route: ActivatedRoute, private cookieHelper: CookieHelper, private userService: ZenithUserService) {
  }

  ngOnInit() {
    this.activeView = 'overall';

    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;

      let username = this.cookieHelper.getCookieByName('username');

      this.isSameUser = this.username == username;

      this.userService.get(this.username).subscribe({
        next: result =>{
          this.dailyData = result;

          this.playStyleSegments = [];

          for(let i = 0; i < this.dailyData.altitudePercentages.length; i++){
            let segment = this.dailyData.altitudePercentages[i];
            let mod =  i === 0  ? 'No Mod' : ModHelper.AvailableModsPrettyString[i - 1];
            let modColor = i === 0 ? '#a8acb0' : `#${ModHelper.ModColors[i - 1]}`;

            if(i === 9){
              mod = 'Reverse Mods'
              modColor = '#b01b47';
            }

            this.playStyleSegments.push({percent: segment,  color: modColor, label: mod})
          }
        }
      })

      let chartHelper = new ChartHelper();

      this.userService.getExtra(this.username).subscribe({
        next: result =>{
          this.dailyDataExtra = result;


          this.floorChartData = {
            datasets: chartHelper.getFloorChartData(this.dailyDataExtra.floors.floors),
            labels: DailyHelper.allFloorFullNames
          }

          const apmValues = this.dailyDataExtra.apm.recent.map(x => x.average);
          const vsValues = this.dailyDataExtra.vs.recent.map(x => x.average);
          const ppsValues = this.dailyDataExtra.pps.recent.map(x => x.average);
          const altitudeValues = this.dailyDataExtra.altitude.recent.map(x => x.average);

          this.apmChartData = this.buildCleanLineChart(
            apmValues,
            this.apmChartOptions,
            chartHelper.getLineChartData(apmValues, 'APM', 'rgb(255 43 156)')
          );

          this.vsChartData = this.buildCleanLineChart(
            vsValues,
            this.vsChartOptions,
            chartHelper.getLineChartData(vsValues, 'VS', 'rgb(102 0 255)')
          );

          this.ppsChartData = this.buildCleanLineChart(
            ppsValues,
            this.ppsChartOptions,
            chartHelper.getLineChartData(ppsValues, 'PPS', 'rgb(40 158 255)')
          );

          this.altitudeChartData = this.buildCleanLineChart(
            altitudeValues,
            this.altitudeChartOptions,
            chartHelper.getLineChartData(altitudeValues, 'Altitude', 'rgb(255 149 43)')
          );
        }
      })

      this.userService.getRuns(this.username, 0, 6).subscribe((runs) => {
        this.recentRuns = runs;
      })

      this.userService.getChallengeCompletions(this.username, 0, 10).subscribe(result => {
        this.challengeCompletions = result;
      })
    })
  }

  private buildCleanLineChart(values: number[], options: ChartConfiguration['options'], datasets: ChartConfiguration['data']['datasets']): ChartConfiguration['data'] {
    if (values.length === 0) {
      return {
        datasets,
        labels: []
      };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 1;

    options ??= {};
    options.scales ??= {};
    options.scales['y'] ??= {};

    options.scales['y'].min = min - padding;
    options.scales['y'].max = max + padding;

    return {
      datasets,
      labels: values.map(() => '')
    };
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

  protected isChallengeBeaten(status: boolean): string {
    return status ? '' : 'grayScale';
  }

  protected isMasteryChallengeBeaten(mastery: any, reverse: boolean ): string {
    let beaten = false;

    if(reverse){
      beaten =
        mastery.expertReversedCompleted &&
        mastery.noHoldReversedCompleted &&
        mastery.messyReversedCompleted &&
        mastery.gravityReversedCompleted &&
        mastery.volatileReversedCompleted &&
        mastery.doubleHoleReversedCompleted &&
        mastery.invisibleReversedCompleted &&
        mastery.allSpinReversedCompleted
    }else{
      beaten =
        mastery.expertCompleted &&
        mastery.noHoldCompleted &&
        mastery.messyCompleted &&
        mastery.gravityCompleted &&
        mastery.volatileCompleted &&
        mastery.doubleHoleCompleted &&
        mastery.invisibleCompleted &&
        mastery.allSpinCompleted
    }

    return beaten ? '' : 'grayScale';
  }

  protected setViewActive(view: string) {
    this.activeView = view;
  }

  protected isActiveView(view: string) {
    return this.activeView === view ? 'active' : '';
  }
}
