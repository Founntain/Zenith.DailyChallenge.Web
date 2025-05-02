import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/network/user.service';
import {NgIf} from '@angular/common';
import {DailyData} from '../../services/network/data/interfaces/DailyData';
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';

@Component({
  selector: 'app-splits',
  imports: [
    NgIf,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef
  ],
  templateUrl: './splits.component.html',
  styleUrl: './splits.component.scss'
})
export class SplitsComponent implements OnInit {
  username: string = '';
  dailyData!: DailyData;
  splitData: any[] = [];

  splitColumns: string[] = ['Hotel', 'Casino', 'Arena', 'Museum', 'Offices', 'Laboratory', 'Core', 'Corruption', 'Potg'];

  constructor(private route: ActivatedRoute, private userService: UserService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;

      this.userService.getSplits(this.username);

      this.userService.getDaily(this.username).subscribe(result => {
        this.dailyData = result;
      });

      this.userService.getSplits(this.username).subscribe(result => {
        this.splitData = result;
      });
    });
  }

  isNotEmptyTime(time: string) {
    return time != '00:00.000';
  }
}
