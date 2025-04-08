import {Component, OnDestroy, OnInit} from '@angular/core';
import {ZenithService} from '../../services/network/zenith.service';
import {ChallengeComponent} from '../challenge/challenge.component';
import { NgIf} from '@angular/common';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';
import {interval} from 'rxjs';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [
    ChallengeComponent,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  dailyChallenges: DailyChallenge[] = [];
  date: string = "";
  runsUntilUnixSeconds: number = 0;

  private timerId: any;
  timeLeft: string = "";


  constructor(private zenithService: ZenithService, private ngZone: NgZone) {

  }

  ngOnInit(): void {
    this.zenithService.getDailyChallenges().subscribe(x => {
      this.dailyChallenges = x;
    })

    this.zenithService.getDates().subscribe(x => {
      this.date = x.dateString;
      this.runsUntilUnixSeconds = x.runsUntilUnixSeconds;

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
