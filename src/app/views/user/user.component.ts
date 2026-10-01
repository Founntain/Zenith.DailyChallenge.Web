import {Component, OnInit, ChangeDetectionStrategy, signal, inject, computed, effect} from '@angular/core';
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
import {
  DailyDataNew,
  DailyDataNewExtra,
  RecentAverage
} from '../../services/network/data/interfaces/DailyData';
import {DatePipe} from '@angular/common';
import {DailyHelper} from '../../util/DailyHelper';
import {BaseChartDirective} from 'ng2-charts';
import {Chart, ChartConfiguration} from 'chart.js';
import {ChartHelper} from '../../util/ChartHelper';
import {BarSegmet, SegmentbarComponent} from '../../components/segmentbar/segmentbar.component';
import {Run} from '../../services/network/data/interfaces/Run';
import {ChallengeCompletion} from '../../services/network/data/interfaces/ChallengeCompletion';
import {ZenithSplitsComponent} from '../../components/zenith-splits/zenith-splits.component';
import {MatTooltip} from '@angular/material/tooltip';
import {default as Annotation} from 'chartjs-plugin-annotation';
import {CommunityChallengeContributions} from '../../services/network/data/interfaces/CommunityChallengeContributions';
import {SeasonalUserData} from '../../services/network/data/interfaces/SeasonalUserData';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-user',
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
    RouterLink,
    MatTooltip
  ],
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private cookieHelper = inject(CookieHelper);
  private userService = inject(ZenithUserService)

  activeView: string = '';

  protected username = signal<string | null>(null);
  isSameUser = signal<boolean>(false);

  playStyleSegments = computed(() => {
    if(! this.dailyData.isLoading() && !this.dailyData.hasValue()) return [];

    const data = this.dailyData.value();
    const segments: BarSegmet[] = [];

    if(data === undefined || data === null) return [];

    for (let i = 0; i < data.altitudePercentages.length; i++) {
      let segment = data.altitudePercentages[i];
      let mod = i === 0 ? 'No Mod' : ModHelper.AvailableModsPrettyString[i - 1];
      let modColor = i === 0 ? '#a8acb0' : `#${ModHelper.ModColors[i - 1]}`;

      if (i === 9) {
        mod = 'Reverse Mods';
        modColor = '#b01b47';
      }

      segments.push({ percent: segment, color: modColor, label: mod });
    }

    return segments;
  });

  protected dailyData = rxResource({
    params: () => ({ username: this.username() }),
    stream: ({ params }: { params: { username: string | null } }) => {
      if (!params.username) {
        throw new Error('Username is required');
      }
      return this.userService.get(params.username).pipe(map(res => res as DailyDataNew));
    },
  });

  protected dailyDataExtra = rxResource({
    params: () => ({ username: this.username() }),
    stream: ({ params }: { params: { username: string | null } }) => {
      if (!params.username) {
        throw new Error('Username is required');
      }
      return this.userService.getExtra(params.username, 30).pipe(map(res => res as DailyDataNewExtra));
    },
  });


  private progressionLimit = signal<number>(100);
  protected progressionData = rxResource({
    params: () => ({
      username: this.username(),
      limit: this.progressionLimit()
    }),
    stream: ({ params }: { params: { username: string | null, limit: number } }) => {
      if (!params.username) {
        throw new Error('Username is required');
      }
      return this.userService.getProgression(params.username, params.limit);
    },
  });

  protected recentRuns = rxResource({
    params: () => ({ username: this.username() }),
    stream: ({ params }: { params: { username: string | null } }) => {
      if (!params.username) {
        throw new Error('Username is required');
      }
      return this.userService.getRuns(params.username, 0, 6).pipe(map(res => res as Run[]));
    },
  });

  protected challengeCompletions = rxResource({
    params: () => ({ username: this.username() }),
    stream: ({ params }: { params: { username: string | null } }) => {
      if (!params.username) {
        throw new Error('Username is required');
      }
      return this.userService.getChallengeCompletions(params.username, 0, 10).pipe(map(res => res as ChallengeCompletion[]));
    },
  });

  protected communityContribution = rxResource({
    params: () => ({ username: this.username() }),
    stream: ({ params }: { params: { username: string | null } }) => {
      if (!params.username) {
        throw new Error('Username is required');
      }
      return this.userService.getCommunityContributions(params.username, 0, 6).pipe(map(res => res as CommunityChallengeContributions[]));
    },
  });

  protected seasonalData = rxResource({
    params: () => ({ username: this.username() }),
    stream: ({ params }: { params: { username: string | null } }) => {
      if (!params.username) {
        throw new Error('Username is required');
      }
      return this.userService.getSeasonalHistory(params.username).pipe(map(res => res as SeasonalUserData[]));
    },
  });

  protected progressionChartData = computed(() => {


    return true;
  });

  modProgression: any[] = [];

  floorChartData = signal<ChartConfiguration['data'] | undefined>(undefined);

  floorChartOptions: ChartConfiguration['options'] = ChartHelper.getFloorChartOptions()

  apmChartData = signal<ChartConfiguration['data'] | undefined>(undefined);
  apmChartOptions: ChartConfiguration['options'] = ChartHelper.getCleanLineChartOptions();

  vsChartData = signal<ChartConfiguration['data'] | undefined>(undefined);
  vsChartOptions: ChartConfiguration['options'] = ChartHelper.getCleanLineChartOptions();

  ppsChartData = signal<ChartConfiguration['data'] | undefined>(undefined);
  ppsChartOptions: ChartConfiguration['options'] = ChartHelper.getCleanLineChartOptions();

  altitudeChartData = signal<ChartConfiguration['data'] | undefined>(undefined);
  altitudeChartOptions: ChartConfiguration['options'] = ChartHelper.getCleanLineChartOptions();

  recentChartData = signal<ChartConfiguration['data'] | undefined>(undefined);
  recentChartOptions: ChartConfiguration['options'] = ChartHelper.getCleanLineChartOptions();

  modBasedChartData = signal<ChartConfiguration['data'] | undefined>(undefined);
  modBasedChartOptions: ChartConfiguration['options'] = ChartHelper.getProgressionChartOptions();

  zenithSplitChartData = signal<ChartConfiguration['data'] | undefined>(undefined);
  zenithSplitChartOptions: ChartConfiguration['options'] = ChartHelper.getSplitsProgressionChartOptions();

  constructor() {
    effect(() => {
      if (this.dailyDataExtra.isLoading() || !this.dailyDataExtra.hasValue()) {
        return null;
      }

      const resultExtra = this.dailyDataExtra.value();
      if (!resultExtra) return null;

      this.floorChartData.set({
        datasets: ChartHelper.getFloorChartData(resultExtra.floors.floors),
        labels: DailyHelper.allFloorFullNames
      });

      const datasetConfigs = [
        { label: 'APM', borderColor: 'rgb(255, 43, 156)', backgroundColor: 'rgb(255, 43, 156)' },
        { label: 'VS', borderColor: 'rgb(102, 0, 255)', backgroundColor: 'rgb(102, 0, 255)' },
        { label: 'PPS', borderColor: 'rgb(40, 158, 255)', backgroundColor: 'rgb(40, 158, 255)' },
        { label: 'Altitude', borderColor: 'rgb(255, 149, 43)', backgroundColor: 'rgb(255, 149, 43)' }
      ];

      const apmValues = resultExtra.apm.recent.map(x => x.average).slice(-5);
      const vsValues = resultExtra.vs.recent.map(x => x.average).slice(-5);
      const ppsValues = resultExtra.pps.recent.map(x => x.average).slice(-5);
      const altitudeValues = resultExtra.altitude.recent.map(x => x.average).slice(-5);
      const recentValues = [
        resultExtra.apm.recent.map(x => x.average),
        resultExtra.vs.recent.map(x => x.average),
        resultExtra.pps.recent.map(x => x.average),
        resultExtra.altitude.recent.map(x => x.average),
      ];

      this.apmChartData.set(this.buildCleanLineChart(
        apmValues,
        this.apmChartOptions,
        ChartHelper.getLineChartData(apmValues, 'APM', 'rgb(255, 43, 156)', 'rgb(255, 43, 156)')
      ));

      this.vsChartData.set(this.buildCleanLineChart(
        vsValues,
        this.vsChartOptions,
        ChartHelper.getLineChartData(vsValues, 'VS', 'rgb(102, 0, 255)', 'rgb(102, 0, 255)')
      ));

      this.ppsChartData.set(this.buildCleanLineChart(
        ppsValues,
        this.ppsChartOptions,
        ChartHelper.getLineChartData(ppsValues, 'PPS', 'rgb(40, 158, 255)', 'rgb(40, 158, 255)')
      ));

      this.altitudeChartData.set(this.buildCleanLineChart(
        altitudeValues,
        this.altitudeChartOptions,
        ChartHelper.getLineChartData(altitudeValues, 'Altitude', 'rgb(255, 149, 43)', 'rgb(255, 149, 43)')
      ));

      const multiLineDatasets = recentValues.map((values, index) =>
        ChartHelper.getLineChartData(
          values,
          datasetConfigs[index].label,
          datasetConfigs[index].borderColor,
          datasetConfigs[index].backgroundColor
        )
      ).flat();

      this.recentChartData.set(this.buildMultiLineChart(
        recentValues,
        this.recentChartOptions,
        multiLineDatasets,
        true
      ));

      if (this.progressionData.isLoading() || !this.progressionData.hasValue()) {
        return null;
      }

      const resultProgressionData = this.progressionData.value();
      if (!resultProgressionData) return null;

      this.modBasedChartData.set({
        datasets: ChartHelper.getModBasedChartData(resultProgressionData.modProgression),
      });

      this.zenithSplitChartData.set({
        datasets: ChartHelper.getZenithSplitChartData(resultProgressionData.splitsProgression),
      });

      return true;
    })
  }

  ngOnInit() {
    Chart.register(Annotation);
    this.activeView = 'overall';

    this.route.paramMap.subscribe(params => {
      this.username.set(params.get('username')!);
      const username = this.cookieHelper.getCookieByName('username');

      this.isSameUser.set(this.username() == username);
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

  private buildMultiLineChart(
    valuesArray: number[][],
    options: ChartConfiguration['options'],
    datasets: ChartConfiguration['data']['datasets'],
    useMultipleAxes: boolean = false
  ): ChartConfiguration['data'] {
    if (valuesArray.length === 0 || valuesArray.every(arr => arr.length === 0)) {
      return {
        datasets,
        labels: []
      };
    }

    options ??= {};
    options.scales ??= {};

    if (useMultipleAxes) {
      // Configure multiple y-axes for different scales
      datasets.forEach((dataset: any, index: number) => {
        const values = valuesArray[index];
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max - min) * 0.1 || 1;

        const axisId = `y${index}`;
        dataset.yAxisID = axisId;

        options.scales![axisId] = {
          type: 'linear',
          position: index % 2 === 0 ? 'left' : 'right',
          min: min - padding,
          max: max + padding,
          display: false, // Hide the axis
          grid: {
            display: false, // Hide grid lines
          }
        };
      });
    } else {
      // Original single axis logic
      const allValues = valuesArray.flat();
      const min = Math.min(...allValues);
      const max = Math.max(...allValues);
      const padding = (max - min) * 0.1 || 1;

      options.scales['y'] = {
        min: min - padding,
        max: max + padding
      };
    }

    const maxLength = Math.max(...valuesArray.map(arr => arr.length));

    return {
      datasets,
      labels: Array(maxLength).fill('')
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

    if(mastery === undefined || mastery === null) return 'grayScale';

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

  protected getTrendingIcon(average: RecentAverage[] | undefined): string[] {

    if ( average === undefined || !average || average.length < 2) return ['', ''];

    const last = average[average.length - 1];
    const secondLast = average[average.length - 2];

    if (last.average > secondLast.average) return ['keyboard_double_arrow_up', 'positive'];
    if (last.average < secondLast.average) return ['keyboard_double_arrow_down', 'negative'];

    return ['keyboard_double_arrow_right', 'neutral'];
  }

  protected checkModProgression(obj: any){
    console.log(obj, Object.values(obj).some(arr => Array.isArray(arr) && arr.length > 0));

    return Object.values(obj).some(arr => Array.isArray(arr) && arr.length > 0);
  }

  protected onProgressionDensityChanged(progressionLimit: number) {
    this.progressionLimit.set(progressionLimit);
  }

  getCommunityContributionvalue(totalAmountContributed: number, conditionType: ConditionType) {
    let totalAsLocale = totalAmountContributed.toLocaleString();

    switch (conditionType) {
      case ConditionType.Height:
        return `${totalAsLocale} M`;
      case ConditionType.KOs:
        return `${totalAsLocale} KO's`;
      case ConditionType.Quads:
        return `${totalAsLocale} Quads`;
      case ConditionType.Spins:
        return `${totalAsLocale} Spins`;
      case ConditionType.AllClears:
        return `${totalAsLocale} All Clears`;
      case ConditionType.Apm:
        return `${totalAsLocale} APM`;
      case ConditionType.Pps:
        return `${totalAsLocale} PPS`;
      case ConditionType.Vs:
        return `${totalAsLocale} VS`;
      case ConditionType.Finesse:
        return `${totalAsLocale}%`;
      case ConditionType.Back2Back:
        return `${totalAsLocale} B2B`;
      case ConditionType.TotalBonus:
        return `${totalAsLocale} Bonus`;
      case ConditionType.App:
        return `${totalAsLocale} APP`;
      case ConditionType.Lines:
        return `${totalAsLocale} Lines`;
    }
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

  protected onImageError(event: ErrorEvent) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  protected readonly DailyHelper = DailyHelper;

  protected openTetrioProfile() {
    if(!this.dailyData) return;

    window.location.href = `https://ch.tetr.io/u/${this.dailyData.value()?.tetrioId}`;
  }

  protected shareRun() {
    navigator.clipboard.writeText(`https://tetrio.founntain.dev/share/${this.username()}`);
  }
}
