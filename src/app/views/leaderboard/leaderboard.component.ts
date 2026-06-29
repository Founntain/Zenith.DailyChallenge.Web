import {Component, OnInit} from '@angular/core';
import {GlobalLeaderboard, SeasonalLeaderboard} from '../../services/network/data/interfaces/GlobalLeaderboard';
import {ZenithService} from '../../services/network/zenith.service';
import {LeaderboardService} from '../../services/network/leaderboard.service';
import {DailyHelper} from '../../util/DailyHelper';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatTooltip} from '@angular/material/tooltip';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  imports: [
    MatIcon,
    RouterLink,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatTooltip,
    NgOptimizedImage,
    MatHeaderCellDef

  ],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  protected readonly DailyHelper = DailyHelper;
  protected currentView: string = 'seasonal';

  globalLeaderboardColumns: string[] = ['Username', 'Score', 'TopRun', 'APM', 'VS', 'Kos', 'Runs'];

  constructor(private leaderboardService: LeaderboardService) {

  }

  seasonalLeaderboard: SeasonalLeaderboard | undefined = undefined;
  allTimeLeaderboard: GlobalLeaderboard | undefined = undefined;
  legacyLeaderboard: GlobalLeaderboard | undefined = undefined;

  ngOnInit() {
    this.leaderboardService.getLeaderboard().subscribe(result => {
      this.seasonalLeaderboard = result;
    })
  }

  onViewChange(view: string){
    this.currentView = view;
  }
}
