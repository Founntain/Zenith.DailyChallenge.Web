import {Component, OnInit, ChangeDetectionStrategy, inject, signal, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {RunResponse} from '../../services/network/data/interfaces/Run';
import {DailyHelper} from '../../util/DailyHelper';
import {RunAnalyzer} from '../../util/RunAnalyzer';
import {MatTooltip} from '@angular/material/tooltip';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-run',
  imports: [
    MatTooltip,
    DatePipe,
    MatIcon
  ],
  templateUrl: './run.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './run.component.scss'
})
export class RunComponent implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(ZenithUserService);

  dailyHelper: DailyHelper = new DailyHelper();
  flavourType = Math.floor(Math.random() * (6 - 1 + 1) + 1);

  username = signal<string>('');
  runId = signal<string>('');

  run = computed(() => {
    if(this.runData.hasValue()) {
      return this.runData.value().run;
    }

    return null;
  })

  splits = computed(() => {
    if(this.runData.hasValue()) {
      return this.runData.value().split;
    }

    return null;
  })

  runData = rxResource({
    params: () => ({ username: this.username(), runId: this.runId() }),
    stream: ({ params }: { params: { username: string | null; runId: string | null } }) => {
      if (!params.username) {
        throw new Error('Username is required');
      }

      if(!params.runId) {
        throw new Error('Run ID is required');
      }

      return this.userService.getRun(params.username, params.runId).pipe(map(res => res as RunResponse));
    },
  });

  agressionScore = computed(() => {
    if (!this.runData.value) return 0;

    const runData = this.runData.value()

    if(!runData) return 0;

    const ra = new RunAnalyzer();

    return ra.calculateAggressionScore(runData?.run!.apm, runData.run!.vs, runData.run!.app, runData.run!.garbageMaxSpike, runData.run!.garbageSent, runData.run!.totalTime);
  });

  defenseScore = computed(() => {
    if (!this.run()) return 0;

    const ra = new RunAnalyzer();

    return ra.calculateDefenseScore(this.run()!.topCombo, this.run()!.garbageCleared, this.run()!.garbageReceived, this.run()!.totalTime, this.run()!.gameOverReason)
  });

  stabilityScore = computed(() => {
    if (!this.run()) return 0;

    const ra = new RunAnalyzer();

    return ra.calculateExecutionScore(this.run()!.finesse, this.run()!.inputs, this.run()!.holds, this.run()!.piecesPlaced)
  });

  pressureScore = computed(() => {
    if (!this.run()) return 0;

    const ra = new RunAnalyzer();

    return ra.calculatePlaystyleScore(this.run()!.quads, this.run()!.spins, this.run()!.back2Back, this.run()!.topCombo)
  });

  totalScore = computed(() => {
    return (this.agressionScore() + this.defenseScore() + this.stabilityScore() + this.pressureScore()) / 4;
  })

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username.set(params.get('username')!);
      this.runId.set(params.get('runId')!);
    });
  }

  floorToName(floor: number) {
    if(floor == 0 && this.run()?.altitude) floor = DailyHelper.getFloorByAltitude(this.run()!.altitude)

    return DailyHelper.getFloorLongName(floor);
  }

  getFloorKey(floor: number) {
    if(floor == 0 && this.run()?.altitude) floor = DailyHelper.getFloorByAltitude(this.run()!.altitude)

    return DailyHelper.getFloorKey(floor);
  }

  roundNumber(value: number, decimalPoints: number = 2){
    return DailyHelper.roundNumber(value, decimalPoints);
  }

  getMods(modString: string) {
    return modString.split(' ');
  }

  getModImage(mod: string) {
    return DailyHelper.getModImageUrl(mod);
  }

  protected gameOverFlavourText(gameOverReason: string) {
    switch (gameOverReason) {
      case 'topout': switch (this.flavourType) {
        case 1: return "Greed claimed another"
        case 2: return "Calculated. Badly"
        case 3: return "Overstack detected"
        case 4: return "Rotation failed"
        case 5: return "Placed pieces out of bounds"
        default: return "Suicide"
      }
      case 'garbagesmash':
        switch (this.flavourType) {
          case 1: return "Out-APM’d"
          case 2: return "Insufficient downstack"
          case 3: return "Counter spike failed"
          case 4: return "Pressure threshold exceeded"
          case 5: return "Garbage delivery successful"
          default: return "Murdered"
        }
      default: return gameOverReason
    }
  }

  protected shareRun() {
    navigator.clipboard.writeText(`https://tetrio.founntain.dev/share/${this.username()}/run/${this.runId()}`);
  }
}
