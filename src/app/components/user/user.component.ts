import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {UserService} from '../../services/network/user.service';
import {ZenithService} from '../../services/network/zenith.service';
import {DailyData} from '../../services/network/data/interfaces/DailyData';
import {NgForOf, NgIf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {Run} from '../../services/network/data/interfaces/Run';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';
import {ChallengeCompletion} from '../../services/network/data/interfaces/ChallengeCompletion';
import {Difficulty} from '../../services/network/data/enums/Difficulty';

@Component({
  selector: 'app-user',
  imports: [
    NgIf,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatPaginatorModule,
    NgForOf
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, AfterViewInit  {
  username!: string;
  dailyData!: DailyData;
  runData: Run[] = [];
  challengeData: ChallengeCompletion[] = [];

  runColumns: string[] = ['Altitude', 'KOs', 'Quads', 'Spins', 'AllClears', 'Mods'];
  challengesColumns: string[] = ['Date', 'Status'];
  dataSource = new MatTableDataSource<Run>(this.runData);

  runPage: number;
  runPageSize: number;
  runPageCount: number;

  challengePage: number;
  challengePageSize: number;
  challengePageCount: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private route: ActivatedRoute, private userApi: UserService, private zenithApi: ZenithService) {
    this.runPage = 0;
    this.runPageSize = 25;
    this.runPageCount = 1;

    this.challengePage = 0;
    this.challengePageSize = 25;
    this.challengePageCount = 1;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;

      this.userApi.getDaily(this.username).subscribe(x => {
        this.dailyData = x;

        this.runPageCount = Math.ceil((this.dailyData.runs / this.runPageSize));

        console.log('daily data', this.dailyData);
      });

      this.loadRunData();
      this.loadChallengeData();
    })
  }

  loadRunData(){
    this.userApi.getRuns(this.username, this.runPage - 1, this.runPageSize).subscribe(x => {
      this.runData = x;

      console.log('run data', this.runData);
    })
  }

  loadChallengeData(){
    this.userApi.getChallengeCompletions(this.username, this.runPage - 1, this.runPageSize).subscribe(x => {
      this.challengeData = x;

      console.log('challenge data', this.challengeData);
    })
  }

  onPageChange(event: any, type: number) {
    switch (type) {
      case 0:
        this.challengePage = event.pageIndex + 1;
        this.challengePageSize = event.pageSize;
        this.loadChallengeData();

        break;
      case 1:
        this.runPage = event.pageIndex + 1;
        this.runPageSize = event.pageSize;
        this.loadRunData();

        break;
    }
  }

  submitRuns() {
    this.zenithApi.submitRuns().subscribe(x => {
      console.log(x)
    })
  }

  getModImage(mod: string) {
    return `/assets/tetrio-img/mods/${mod}.png`;
  }

  getModArray(mods: string) {
    if (mods?.length === 0) return [];

    return mods.split(' ');
  }

  getCompletedImage(difficulty: Difficulty, completed: any)
  {
    switch (difficulty) {
      case Difficulty.Easy:
        return completed ? '/assets/clear_easy.png' : '/assets/unclear_easy.png';
      case Difficulty.Normal:
          return completed ? '/assets/clear_normal.png' : '/assets/unclear_normal.png';
      case Difficulty.Hard:
        return completed ? '/assets/clear_hard.png' : '/assets/unclear_hard.png';
      case Difficulty.Expert:
        return completed ? '/assets/clear_expert.png' : '/assets/unclear_expert.png';
      default: return '';
    }
  }

  isNotEmptyTime(time: string){
    return time != '00:00.000';
  }

  protected readonly Difficulty = Difficulty;
}
