import {Component, OnDestroy, OnInit} from '@angular/core';
import {ZenithService} from '../../services/network/zenith.service';
import {ChallengeComponent} from '../challenge/challenge.component';
import {NgForOf, NgIf} from '@angular/common';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';
import {interval} from 'rxjs';
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
  dailyChallenges: DailyChallenge[] = [];
  date: string = "";
  runsUntilUnixSeconds: number = 0;

  leaderboardData: DailyLeaderboard[] = [];
  leaderboardColumns: string[] = ['Username', 'ChallengesCompleted'];

  private timerId: any;
  timeLeft: string = "";

  constructor(private zenithService: ZenithService, private ngZone: NgZone) {

  }

  ngOnInit(): void {
    this.zenithService.getDailyChallenges().subscribe(result => {
      this.dailyChallenges = result;
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
          });
        });
      });
    })
  }

  private updateTimeLeft(){
    if(this.runsUntilUnixSeconds == 0 && this.date == "") return;

    const currentDate = new Date();
    const targetDate = new Date(this.runsUntilUnixSeconds * 1000); // Convert Unix seconds to milliseconds

    const timeDifference = targetDate.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      this.timeLeft = "Time's up!";
      return;
    }

    const seconds = Math.floor((timeDifference / 1000) % 60);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    this.timeLeft = `${hours}h ${minutes}m ${seconds}s`;
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      this.timerId.unsubscribe();
    }
  }

}
