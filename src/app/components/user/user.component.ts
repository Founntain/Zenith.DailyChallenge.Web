import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {ZenithService} from '../../services/network/zenith.service';
import {DailyData} from '../../services/network/data/interfaces/DailyData';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {Run} from '../../services/network/data/interfaces/Run';
import {ChallengeCompletion} from '../../services/network/data/interfaces/ChallengeCompletion';
import {Difficulty} from '../../services/network/data/enums/Difficulty';
import {CookieHelper} from '../../util/CookieHelper';
import {CommunityChallengeContributions} from '../../services/network/data/interfaces/CommunityChallengeContributions';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {MatIcon} from '@angular/material/icon';
import {SettingsService} from '../../services/settings.service';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {isValidDate} from 'rxjs/internal/util/isDate';
import {Splits} from '../../services/network/data/interfaces/Splits';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-user',
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatPaginatorModule,
    NgClass,
    MatIcon,
    RouterLink,
    BaseChartDirective,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, AfterViewInit {
  username!: string;

  isAutoUpdate: boolean = false;
  isSameUser: boolean = false;

  dailyData!: DailyData;
  runData: Run[] = [];
  challengeData: ChallengeCompletion[] = [];
  communityContributionData: CommunityChallengeContributions[] = [];

  runColumns: string[] = ['Altitude', 'APM', 'PPS', 'VS', 'KOs', 'Quads', 'Spins', 'AllClears', 'Back2Back', 'Mods'];
  challengesColumns: string[] = ['Date', 'Status'];
  communityChallengeColumns: string[] = ['Date', 'Contribution'];

  chartData: ChartConfiguration['data'] | undefined;
  chartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: .1,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {
        ticks: {
          color: '#e2e8f0',
          font: {
            family: 'Hind Madurai',
            weight: 'bold',
            size: 14,
          }
        }
      },
      yRight: {
        position: 'right',
        grid: {
          color: 'rgb(169, 116, 212, .5)',
        },
        ticks: {
          color: 'rgb(169, 116, 212, 1)',
          font: {
            family: 'Hind Madurai',
            weight: 'bold',
            size: 18,
          }
        },
      },
      yLeft: {
        position: 'left',
        grid: {
          color: 'rgb(255, 255, 255, 0.25)',
        },
        ticks: {
          color: '#e2e8f0',
          font: {
            family: 'Hind Madurai',
            weight: 'bold',
            size: 18,
          }
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: 'Hind Madurai',
            weight: 'bold',
            size: 16,
          }
        }
      }
    }
  }

  dataSource = new MatTableDataSource<Run>(this.runData);

  runPage: number;
  runPageSize: number;
  runPageCount: number;

  challengePage: number;
  challengePageSize: number;
  challengePageCount: number;

  communityChallengePage: number;
  communityChallengePageSize: number;
  communityChallengePageCount: number;

  floors: (keyof Splits)[] = ['hotel', 'casino', 'arena', 'museum', 'offices', 'laboratory', 'core', 'corruption', 'potg'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private route: ActivatedRoute,
    private userService: ZenithUserService,
    private zenithService: ZenithService,
    private cookieHelper: CookieHelper,
    private settingsService: SettingsService
  ) {
    this.runPage = 1;
    this.runPageSize = 25;
    this.runPageCount = 1;

    this.challengePage = 1;
    this.challengePageSize = 25;
    this.challengePageCount = 1;

    this.communityChallengePage = 1;
    this.communityChallengePageSize = 25;
    this.communityChallengePageCount = 1;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;

      let username = this.cookieHelper.getCookieByName('username');

      this.isSameUser = this.username == username;

      this.userService.getDaily(this.username).subscribe(result => {
        this.dailyData = result;

        this.runPageCount = Math.ceil((this.dailyData.runs / this.runPageSize));
      });

      this.userService.getDailyExtra(this.username).subscribe(result => {
        this.chartData = {
          datasets: [
            {
              data: result.map(x => {return x.apm.avg}),
              label: 'Average APM',
              borderColor: 'rgb(129,205,252)',
              backgroundColor: 'rgba(0,0,0,0)',
              pointBackgroundColor: 'rgba(255,255,255,1)',
              pointBorderColor: 'rgb(129,205,252)',
              fill: 'origin',
              yAxisID: 'yLeft',
            },
            {
              data: result.map(x => {return x.apm.max}),
              label: 'Peak APM',
              borderColor: 'rgb(50,142,234)',
              backgroundColor: 'rgba(0,0,0,0)',
              pointBackgroundColor: 'rgba(255,255,255,1)',
              pointBorderColor: 'rgb(50,142,234)',
              fill: 'origin',
              yAxisID: 'yLeft',
            },

            {
              data: result.map(x => {return x.vs.avg}),
              label: 'Average VS',
              borderColor: 'rgb(255,206,142)',
              backgroundColor: 'rgba(0,0,0,0)',
              pointBackgroundColor: 'rgba(255,255,255,1)',
              pointBorderColor: 'rgb(255,206,142)',
              fill: 'origin',
              yAxisID: 'yLeft',
            },
            {
              data: result.map(x => {return x.vs.max}),
              label: 'Peak VS',
              borderColor: 'rgb(255,155,84)',
              backgroundColor: 'rgba(0,0,0,0)',
              pointBackgroundColor: 'rgba(255,255,255,1)',
              pointBorderColor: 'rgb(255,155,84)',
              fill: 'origin',
              yAxisID: 'yLeft',
            },

            {
              data: result.map(x => {return x.altitude.avg}),
              label: 'Average Altitude',
              borderColor:'rgb(187,136,253)',
              backgroundColor: 'rgba(0,0,0,0)',
              pointBackgroundColor: 'rgba(255,255,255,1)',
              pointBorderColor: 'rgb(150,28,248)',
              fill: 'origin',
              yAxisID: 'yRight',
            },
            {
              data: result.map(x => {return x.altitude.max}),
              label: 'Peak Altitude',
              borderColor: 'rgb(124,71,215)',
              backgroundColor: 'rgba(0,0,0,0.25)',
              pointBackgroundColor: 'rgba(255,255,255,1)',
              pointBorderColor: 'rgb(150,28,248)',
              fill: 'origin',
              yAxisID: 'yRight',
            },
          ],
          labels: result.map(x => {return x.date})
        }
      });

      this.loadRunData();
      this.loadChallengeData();
      this.loadCommunityContributionData();
    })

    this.settingsService.autoUpdate$.subscribe(
      value => this.isAutoUpdate = value
    );
  }

  private loadRunData() {
    this.userService.getRuns(this.username, this.runPage - 1, this.runPageSize).subscribe(result => {
      this.runData = result;
    })
  }

  private loadChallengeData() {
    this.userService.getChallengeCompletions(this.username, this.challengePage - 1, this.challengePageSize).subscribe(result => {
      this.challengeData = result;
    })
  }

  private loadCommunityContributionData() {
    this.userService.getCommunityContributions(this.username, this.communityChallengePage - 1, this.challengePageSize).subscribe(result => {
      this.communityContributionData = result;
    })
  }

  onPageChange(event: any, type: number) {
    switch (type) {
      case 0:
        this.challengePage = event.pageIndex + 1;
        this.challengePageSize = event.pageSize;
        this.loadChallengeData();

        break;
      case 1:
        this.communityChallengePage = event.pageIndex + 1;
        this.communityChallengePageSize = event.pageSize;
        this.loadCommunityContributionData();
        break;
      case 2:
        this.runPage = event.pageIndex + 1;
        this.runPageSize = event.pageSize;
        this.loadRunData();

        break;
    }
  }

  submitRuns() {
    this.zenithService.submitRuns().subscribe({
      next: (r) => {
        window.location.reload();
      },
      error: (e) => {
        if (e.status == 400) {
          alert(e.error);
        }
        if (e.status == 401) {
          alert(e.error + '\n\nPlease login again.');
          // window.location.reload();
        }
      }
    })
  }

  getModImage(mod: string) {
    return `/assets/tetrio-img/mods/${mod}.png`;
  }

  getModArray(mods: string) {
    if (mods?.length === 0) return [];

    return mods.split(' ');
  }

  getCompletedImage(completed: any) {
    return completed ? "" : "challengeUncompleted"
  }

  isNotEmptyTime(time: string) {
    return time != '00:00.000';
  }

  protected readonly Difficulty = Difficulty;

  getSpeedrunCompletedClass(altitude: number, speedrun: boolean, speedrunSeen: boolean) {
    if (speedrun && altitude >= 1650) {
      return 'speedrun';
    }

    if (speedrunSeen || (speedrun && altitude < 1650)) {
      return 'speedrunSeen';
    }

    return 'noSpeedrun'
  }

  getCommunityContributionvalue(totalAmountContributed: number, conditionType: ConditionType) {
    switch (conditionType) {
      case ConditionType.Height:
        return `${totalAmountContributed} M`;
      case ConditionType.KOs:
        return `${totalAmountContributed} KO's`;
      case ConditionType.Quads:
        return `${totalAmountContributed} Quads`;
      case ConditionType.Spins:
        return `${totalAmountContributed} Spins`;
      case ConditionType.AllClears:
        return `${totalAmountContributed} All Clears`;
      case ConditionType.Apm:
        return `${totalAmountContributed} APM`;
      case ConditionType.Pps:
        return `${totalAmountContributed} PPS`;
      case ConditionType.Vs:
        return `${totalAmountContributed} VS`;
      case ConditionType.Finesse:
        return `${totalAmountContributed}%`;
      case ConditionType.Back2Back:
        return `${totalAmountContributed} B2B`;
      case ConditionType.TotalBonus:
        return `${totalAmountContributed} Bonus`;
    }
  }

  openTetrioProfile() {
    window.location.href = `https://ch.tetr.io/u/${this.dailyData.tetrioId}`;
  }

  onAutoTrackingChanged(event: any) {
    let isChecked: boolean = event?.target?.checked ?? false;

    this.settingsService.setAutoUpdate(isChecked);
  }

  getSplitText(time: any, average = false) {
    if(this.isNotEmptyTime(time)){
      return time;
    }else{
      if(average){
        return 'Not reached yet';
      }
      return '';
    }
  }

  getFloorReachedCss(time: any) {
    if(!this.isNotEmptyTime(time)){
      return 'notReached';
    }else{
      return '';
    }
  }
}
