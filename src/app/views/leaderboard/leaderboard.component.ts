import {Component, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {GlobalLeaderboard} from '../../services/network/data/interfaces/GlobalLeaderboard';
import {ZenithService} from '../../services/network/zenith.service';
import {RouterLink} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTooltip} from '@angular/material/tooltip';
import {LeaderboardService} from '../../services/network/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    NgOptimizedImage,
    RouterLink,
    MatPaginator,
    MatHeaderCellDef,
    MatTooltip,
  ],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  constructor(private zenithService: ZenithService, private leaderboardService: LeaderboardService) {
    this.page = 1;
    this.pageSize = 30;
    this.pageCount = 10;
  }

  leaderboardData: GlobalLeaderboard | undefined = undefined;
  leaderboardColumns: string[] = ['Username', 'Score', 'EasyChallengesCompleted', 'NormalChallengesCompleted', 'HardChallengesCompleted', 'ExpertChallengesCompleted', 'ReverseChallengesCompleted', 'MasteryChallengesCompleted'];

  page: number;
  pageSize: number;
  pageCount: number;

  ngOnInit() {
    this.leaderboardService.getGlobalLeaderboard().subscribe(result => {
      this.leaderboardData = result;
    })
  }

  onPageChange(event: any) {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.loadLeaderboardData();
    }

  private loadLeaderboardData() {
    this.leaderboardService.getGlobalLeaderboard(this.page, this.pageSize).subscribe(result => {
      this.leaderboardData = result;
    })
  }
}
