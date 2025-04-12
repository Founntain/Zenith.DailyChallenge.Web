import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/network/user.service';
import {ZenithService} from '../../services/network/zenith.service';
import {DailyData} from '../../services/network/data/interfaces/DailyData';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {Run} from '../../services/network/data/interfaces/Run';
import {ChallengeCompletion} from '../../services/network/data/interfaces/ChallengeCompletion';
import {Difficulty} from '../../services/network/data/enums/Difficulty';
import {CookieHelper} from '../../util/CookieHelper';
import {CommunityChallengeContributions} from '../../services/network/data/interfaces/CommunityChallengeContributions';
import {ConditionType} from '../../services/network/data/enums/ConditionType';

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
    NgForOf,
    NgClass
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, AfterViewInit  {
  username!: string;

  isSameUser: boolean = false;

  dailyData!: DailyData;
  runData: Run[] = [];
  challengeData: ChallengeCompletion[] = [];
  communityContributionData: CommunityChallengeContributions[] = [];

  runColumns: string[] = ['Altitude', 'APM', 'PPS', 'VS', 'KOs', 'Quads', 'Spins', 'AllClears', 'Finesse', 'Mods'];
  challengesColumns: string[] = ['Date', 'Status'];
  communityChallengeColumns: string[] = ['Date', 'Contribution'];

  dataSource = new MatTableDataSource<Run>(this.runData);

  runPage: number;
  runPageSize: number;
  runPageCount: number;

  challengePage: number;
  challengePageSize: number;
  challengePageCount: number;

  communityChallengePage: number;
  communityChallengePageSize: number;
  communityChallengePageCount: number;


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private route: ActivatedRoute, private userService: UserService, private zenithService: ZenithService) {
    this.runPage = 1;
    this.runPageSize = 25;
    this.runPageCount = 1;

    this.challengePage = 1;
    this.challengePageSize = 25;
    this.challengePageCount = 1;

    this.communityChallengePage = 1;
    this.communityChallengePageSize = 25;
    this.communityChallengePageCount = 1;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;

      let cookieHelper = new CookieHelper();
      let username = cookieHelper.getCookieByName('username');

      this.isSameUser = this.username == username;

      this.userService.getDaily(this.username).subscribe(x => {
        this.dailyData = x;

        this.runPageCount = Math.ceil((this.dailyData.runs / this.runPageSize));

        console.log('daily data', this.dailyData);
      });

      this.loadRunData();
      this.loadChallengeData();
      this.loadCommunityContributionData();
    })
  }

  private loadRunData(){
    this.userService.getRuns(this.username, this.runPage - 1, this.runPageSize).subscribe(result => {
      this.runData = result;
    })
  }

  private loadChallengeData(){
    this.userService.getChallengeCompletions(this.username, this.runPage - 1, this.runPageSize).subscribe(result => {
      this.challengeData = result;
    })
  }

  private loadCommunityContributionData() {
    this.userService.getCommunityContributions(this.username, this.communityChallengePage - 1, this.challengePageSize).subscribe(result => {
      this.communityContributionData = result;
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
        this.communityChallengePage = event.pageIndex + 1;
        this.communityChallengePageSize = event.pageSize;
        this.loadCommunityContributionData();
        break;
      case 2:
        this.runPage = event.pageIndex + 1;
        this.runPageSize = event.pageSize;
        this.loadRunData();

        break;
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

  getSpeedrunCompletedClass(speedrun: boolean, speedrunSeen: boolean) {
    if(speedrun){
      return 'speedrun';
    }

    if(speedrunSeen){
      return 'speedrunSeen';
    }

    return 'noSpeedrun'
  }

  getCommunityContributionvalue(totalAmountContributed: number, conditionType: ConditionType) {
    console.log("ct", conditionType, totalAmountContributed)

    switch (conditionType){
      case ConditionType.Height:
        return `${totalAmountContributed} M`;
      case ConditionType.KOs:
        return`${totalAmountContributed} KO's`;
      case ConditionType.Quads:
        return `${totalAmountContributed} quads`;
      case ConditionType.Spins:
        return `${totalAmountContributed} spins`;
      case ConditionType.AllClears:
        return `${totalAmountContributed} all clears`;
      case ConditionType.Apm:
        return `${totalAmountContributed} APM`;
      case ConditionType.Pps:
        return `${totalAmountContributed} PPS`;
      case ConditionType.Vs:
        return `${totalAmountContributed} VS`;
      case ConditionType.Finesse:
        return `${totalAmountContributed}%`;
    }
  }
}
