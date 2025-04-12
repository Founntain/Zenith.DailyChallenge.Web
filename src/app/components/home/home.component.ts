import {Component, OnDestroy, OnInit} from '@angular/core';
import {ZenithService} from '../../services/network/zenith.service';
import {ChallengeComponent} from '../challenge/challenge.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';
import {concatWith, interval} from 'rxjs';
import { NgZone } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {DailyLeaderboard} from '../../services/network/data/interfaces/DailyLeaderboard';
import {RouterLink} from '@angular/router';
import {CommunityChallenge} from '../../services/network/data/interfaces/CommunityChallenge';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {AuthService} from '../../services/network/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    ChallengeComponent,
    NgIf,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;

  dailyChallenges: DailyChallenge[] = [];
  date: string = "";
  runsUntilUnixSeconds: number = 0;
  communityChallengeEndDateUnixSeconds: number = 0;

  leaderboardData: DailyLeaderboard[] = [];
  leaderboardColumns: string[] = ['Username', 'ChallengesCompleted'];

  communityChallengeData: CommunityChallenge | undefined;

  private timerId: any;
  timeLeft: string = "";
  communityTimeLeft: string = "";

  constructor(private zenithService: ZenithService, private authService: AuthService, private ngZone: NgZone) {

  }

  ngOnInit(): void {
    this.zenithService.getDailyChallenges().subscribe(result => {
      this.dailyChallenges = result;
    })

    this.zenithService.getCommunityChallenge().subscribe(result => {
      this.communityChallengeData = result;
      this.communityChallengeEndDateUnixSeconds = result.endsAtUnixSeconds;
    })

    this.zenithService.getLeaderboard().subscribe(result => {
      this.leaderboardData = result;
    })

    this.zenithService.getDates().subscribe(result => {
      this.date = result.dateString;
      this.runsUntilUnixSeconds = result.runsUntilUnixSeconds;

      this.ngZone.runOutsideAngular(() => {
        this.timerId = interval(1000).subscribe(() => {
          this.ngZone.run(() => {
            this.updateTimeLeft();
            this.updateCommunityTimeLeft();
          });
        });
      });
    })

    this.authService.isUserAuthorized().subscribe({
      next: (result) => {
        if(result != null){
          this.isLoggedIn = true;
        }
      },
      error: (e) => {
        this.isLoggedIn = false;
      }
    })
  }

  private unixSecondsToString(unixSeconds: number): [number, number, number, number]{
    const days = Math.floor(unixSeconds / (1000 * 60 * 60 * 24));
    const seconds = Math.floor((unixSeconds / 1000) % 60);
    const minutes = Math.floor((unixSeconds / (1000 * 60)) % 60);
    const hours = Math.floor((unixSeconds / (1000 * 60 * 60)) % 24);

    return [days, hours, minutes, seconds];
  }

  private updateCommunityTimeLeft(){
    if(this.communityChallengeEndDateUnixSeconds == 0) return;

    const currentDate = new Date();
    const targetDate = new Date(this.communityChallengeEndDateUnixSeconds * 1000);

    const timeDifference = targetDate.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      this.timeLeft = "Time's up!";
      return;
    }

    let timeTuple = this.unixSecondsToString(timeDifference);

    this.communityTimeLeft = `${timeTuple[0]}d ${timeTuple[1]}h ${timeTuple[2]}m ${timeTuple[3]}s`;
  }

  private updateTimeLeft(){
    if(this.runsUntilUnixSeconds == 0 && this.date == "") return;

    const currentDate = new Date();
    const targetDate = new Date(this.runsUntilUnixSeconds * 1000);

    const timeDifference = targetDate.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      this.timeLeft = "Time's up!";
      return;
    }

    let timeTuple = this.unixSecondsToString(timeDifference);

    this.timeLeft = `${timeTuple[1]}h ${timeTuple[2]}m ${timeTuple[3]}s`;
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      this.timerId.unsubscribe();
    }
  }

  submitRuns() {
    this.zenithService.submitRuns().subscribe({
      next: (r) => {
        window.location.reload();
      },
      error: (e) => {
        if(e.status == 400){
          alert(e.error);
        }
        if(e.status == 401){
          alert(e.error + '\n\nPlease login again.');
          // window.location.reload();
        }
      }
    })
  }

  getCommunityPromptPrefix() {
    let prompt = "";

    switch (this.communityChallengeData?.communityChallenge.conditionType){
      case ConditionType.Height:
        prompt = "Climb a total of "
        break;
      case ConditionType.KOs:
        prompt = "Eradicate a total of "
        break;
      case ConditionType.Quads:
      case ConditionType.Spins:
      case ConditionType.AllClears:
        prompt = "Clear a total of "
        break;
      case ConditionType.Apm:
      case ConditionType.Pps:
      case ConditionType.Vs:
        prompt = "Achieve a total of "
        break;
    }

    return prompt;
  }

  getCommunityPromptValue() {
    let prompt = "";
    let value = this.communityChallengeData?.communityChallenge.targetValue.toLocaleString('en-US');

    switch (this.communityChallengeData?.communityChallenge.conditionType) {
      case ConditionType.Height:
        prompt = `${value} M`
        break;
      case ConditionType.KOs:
        prompt = `${value} `
        break;
      case ConditionType.Quads:
        prompt = `${value} quads`
        break;
      case ConditionType.Spins:
        prompt = `${value} spins`
        break;
      case ConditionType.AllClears:
        prompt = `${value} all clears`
        break;
      case ConditionType.Apm:
        prompt = `${value} APM`
        break;
      case ConditionType.Pps:
        prompt = `${value} PPS`
        break;
      case ConditionType.Vs:
        prompt = `${value} VS`
        break;
    }

    return prompt;
  }

  getCommunityPromptSuffix() {
    let prompt = "";

    switch (this.communityChallengeData?.communityChallenge.conditionType){
      case ConditionType.Height:
        prompt = ", while in search for salvation"
        break;
      case ConditionType.KOs:
        prompt = " lost souls searching for the gods"
        break;
      case ConditionType.Quads:
      case ConditionType.Spins:
      case ConditionType.AllClears:
        prompt = ", without making the walls fall"
        break;
      case ConditionType.Apm:
      case ConditionType.Pps:
      case ConditionType.Vs:
        prompt = ", by unleashing the power of the gods within you"
        break;
    }

    return prompt;
  }

  getCommunityPromptProgressSuffix() {
    let prompt = "";

    switch (this.communityChallengeData?.communityChallenge.conditionType){
      case ConditionType.Height:
        prompt = "climbed"
        break;
      case ConditionType.KOs:
        prompt = " souls freed"
        break;
      case ConditionType.Quads:
        prompt = " quads cleared"
        break;
      case ConditionType.Spins:
        prompt = " spins cleared"
        break;
      case ConditionType.AllClears:
        prompt = " all clears cleared"
        break;
      case ConditionType.Apm:
        prompt = "apm unleashed"
        break;
      case ConditionType.Pps:
        prompt = "pps unleashed"
        break;
      case ConditionType.Vs:
        prompt = "vs unleashed"
        break;
    }

    return prompt;
  }
}
