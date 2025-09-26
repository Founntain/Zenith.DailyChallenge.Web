import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {ZenithService} from '../../services/network/zenith.service';
import {DailyData} from '../../services/network/data/interfaces/DailyData';
import {NgClass} from '@angular/common';
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

import {Splits} from '../../services/network/data/interfaces/Splits';
import { BaseChartDirective } from 'ng2-charts';
import {Chart, ChartConfiguration, ChartEvent, ChartType} from 'chart.js';
import {MatChip, MatChipAvatar, MatChipListbox, MatChipOption, MatChipSet} from '@angular/material/chips';
import {ZenithSplits} from '../../services/network/data/interfaces/ZenithSplits';
import {MatCheckbox} from '@angular/material/checkbox';
import {DailyExtra} from '../../services/network/data/interfaces/DailyExtra';
import {ChartHelper} from '../../util/ChartHelper';
import { default as Annotation } from 'chartjs-plugin-annotation';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';

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
    MatChipAvatar,
    MatChipListbox,
    MatChipOption,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatSelect
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, AfterViewInit {
  username!: string;

  isAutoUpdate: boolean = false;
  isSameUser: boolean = false;

  dailyData!: DailyData;
  splitTimes!: ZenithSplits;
  runData: Run[] = [];
  challengeData: ChallengeCompletion[] = [];
  communityContributionData: CommunityChallengeContributions[] = [];

  splitMods:string[] =  ['nomod', 'expert', 'nohold', 'messy', 'gravity', 'volatile', 'doublehole', 'invisible', 'allspin', 'expert_reversed', 'nohold_reversed', 'messy_reversed', 'gravity_reversed', 'volatile_reversed', 'doublehole_reversed', 'invisible_reversed', 'allspin_reversed']
  splitModsText: string[] = ['No Mod', 'Expert', 'No Hold', 'Messy', 'Gravity', 'Volatile', 'Double Hole', 'Invisible', 'All Spin', 'The Tyrant', 'Asceticism', 'Loaded Dice', 'Freefall', 'Last Stand', 'Damnation', 'The Exile', 'The Warlock']

  runColumns: string[] = ['Altitude', 'APM', 'PPS', 'VS', 'KOs', 'Quads', 'Spins', 'AllClears', 'Back2Back', 'Mods'];
  challengesColumns: string[] = ['Date', 'Status'];
  communityChallengeColumns: string[] = ['Date', 'Contribution'];

  dailyExtra: DailyExtra = { recentDays: [], modProgression: [] };
  recentDaysChartData: ChartConfiguration['data'] | undefined;
  modBasedChartData: ChartConfiguration['data'] | undefined;
  recentDaysChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: .1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e2e8f0',
          font: {
            family: 'Hind Madurai',
            weight: 'bold',
            size: 14,
          },
        },
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
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        titleAlign: 'center',
        titleFont: {
          family: 'Hind Madurai',
          weight: 'bold',
          size: 18,
        },
        bodyFont: {
          family: 'Hind Madurai',
          weight: 'bold',
          size: 16,
        },
      },
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
  modBasedChartOptions: ChartConfiguration['options'] = {}

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
    Chart.register(Annotation);
    let chartHelper = new ChartHelper();

    this.modBasedChartOptions = {
      elements: {
        line: {
          borderWidth: 2,
          tension: 1,
          stepped: 'after'
        },
        point: {
          radius: 0,
            hitRadius: 10
        }
      },
      scales: {
        x: {
          beginAtZero: false,
          min: 1,
          type: 'linear',
            ticks: {
            color: '#e2e8f0',
              autoSkip: true,
              font: {
                family: 'Hind Madurai',
                weight: 'bold',
                size: 14,
              }
          }
        },
        y: {
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
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          titleFont: {
            size: 0
          },
          bodyFont: {
            family: 'Hind Madurai',
            weight: 'bold',
            size: 18,
          }
        },
        legend: {
          labels: {
            font: {
              family: 'Hind Madurai',
                weight: 'bold',
                size: 16,
            }
          }
        },
        annotation: chartHelper.getModChartAnnotations()
      }
    }

    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;

      let username = this.cookieHelper.getCookieByName('username');

      this.isSameUser = this.username == username;

      this.userService.getDaily(this.username).subscribe(result => {
        this.dailyData = result;

        this.runPageCount = Math.ceil((this.dailyData.runs / this.runPageSize));
      });


      this.loadDailyExtra();
      this.loadSplitTimes(null, false)
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
    let isChecked: boolean = event?.checked ?? false;

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

  getModImageFromModList(mod: string) {
    return mod.toLowerCase().replace(/\s+/g, "");
  }

  onSplitFilterChanged(event: any) {
    let selectedValue: string;

    if(event.value === undefined)
      selectedValue = '';
    else
      selectedValue = this.getModImageFromModList(event.value)

    this.loadSplitTimes(selectedValue, false);
  }

  private loadSplitTimes(mod: string | any, soloMod: boolean) {
    this.userService.getBestSplits(this.username, mod, soloMod).subscribe(result => {
      this.splitTimes = result;
    });
  }

  onProgressionDensityChanged(event: any) {
    this.loadDailyExtra(event.value)
  }

  private loadDailyExtra(progressionLimit: number = 100) {
    let chartHelper = new ChartHelper();

    this.userService.getDailyExtra(this.username, progressionLimit).subscribe(result => {
      this.dailyExtra = result;

      this.recentDaysChartData = {
        datasets: chartHelper.getRecentDaysChartData(this.dailyExtra.recentDays),
        labels: this.dailyExtra.recentDays.map(x => {return x.date})
      }

      this.modBasedChartData = {
        datasets: chartHelper.getModBasedChartData(this.dailyExtra.modProgression),
      }
    });
  }
}
