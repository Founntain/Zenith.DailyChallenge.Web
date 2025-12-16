import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZenithUserService } from '../../services/network/zenith-user.service';
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
import {ZenithSplits} from '../../services/network/data/interfaces/ZenithSplits';

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
  splitTimes: ZenithSplits | undefined;
  splitData: any[] = [];

  splitColumns: string[] = ['Hotel', 'Casino', 'Arena', 'Museum', 'Offices', 'Laboratory', 'Core', 'Corruption', 'Potg'];

  constructor(private route: ActivatedRoute, private userService: ZenithUserService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;

      this.userService.getSplits(this.username);

      this.userService.getBestSplits(this.username).subscribe(result => {
        this.splitTimes = result;
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
