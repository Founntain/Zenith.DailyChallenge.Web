import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {ZenithService} from '../../services/network/zenith.service';
import {CookieHelper} from '../../util/CookieHelper';
import {SettingsService} from '../../services/settings.service';
import {DetailedRun} from '../../services/network/data/interfaces/Run';
import {ChallengeHelper} from '../../util/ChallengeHelper';
import {DailyHelper} from '../../util/DailyHelper';
import {Splits} from '../../services/network/data/interfaces/Splits';
import {RunAnalyzer} from '../../util/RunAnalyzer';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-run',
  imports: [
    MatTooltip
  ],
  templateUrl: './run.component.html',
  styleUrl: './run.component.scss'
})
export class RunComponent implements OnInit{
  dailyHelper: DailyHelper = new DailyHelper();
  flavourType = Math.floor(Math.random() * (6 - 1 + 1) + 1);

  username!: string;
  runId!: string;

  run: DetailedRun | undefined;
  splits: Splits | undefined;

  agressionScore: number = 0;
  defenseScore: number = 0;
  stabilityScore: number = 0;
  pressureScore: number = 0;
  totalScore: number = 0;

  constructor(
    private route: ActivatedRoute,
    private userService: ZenithUserService,
    private zenithService: ZenithService,
    private cookieHelper: CookieHelper,
    private settingsService: SettingsService,
    private readonly router: Router
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;
      this.runId = params.get('runId')!;

      this.userService.getRun(this.username, this.runId).subscribe(result => {
        this.run = result.run;
        this.splits = result.split;

        const ra = new RunAnalyzer();

        this.agressionScore = ra.calculateAggressionScore(this.run!.apm, this.run!.vs, this.run!.app, this.run!.garbageMaxSpike, this.run!.garbageSent, this.run!.totalTime);
        this.defenseScore = ra.calculateDefenseScore(this.run!.topCombo, this.run!.garbageCleared, this.run!.garbageReceived, this.run!.totalTime, this.run!.gameOverReason)
        this.stabilityScore = ra.calculateExecutionScore(this.run!.finesse, this.run!.inputs, this.run!.holds, this.run!.piecesPlaced)
        this.pressureScore = ra.calculatePressureScore(this.run!.apm, this.run!.vs, this.run!.app, this.run!.garbageCleared, this.run!.garbageReceived)

        // Calculate total score
        this.totalScore = (this.agressionScore + this.defenseScore + this.stabilityScore + this.pressureScore) / 4;
      })
    });
  }


  floorToName(floor: number) {
    if(floor == 0 && this.run?.altitude) floor = this.dailyHelper.getFloorByAltitude(this.run.altitude)

    return this.dailyHelper.getFloorLongName(floor);
  }

  getFloorKey(floor: number) {
    if(floor == 0 && this.run?.altitude) floor = this.dailyHelper.getFloorByAltitude(this.run.altitude)

    return this.dailyHelper.getFloorKey(floor);
  }

  roundNumber(value: number, decimalPoints: number = 2){
    return this.dailyHelper.roundNumber(value, decimalPoints);
  }

  getMods(modString: string) {
    return modString.split(' ');
  }

  getModImage(mod: string) {
    return this.dailyHelper.getModImageUrl(mod);
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
}
