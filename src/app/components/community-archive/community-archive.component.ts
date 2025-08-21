import {Component, OnInit} from '@angular/core';
import {ArchiveService} from '../../services/network/archive.service';
import {CommunityChallengeArchive} from '../../services/network/data/interfaces/CommunityChallengeArchive';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {RouterLink} from '@angular/router';
import {ConditionType} from '../../services/network/data/enums/ConditionType';

@Component({
  selector: 'app-community-archive',
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
    MatHeaderCellDef,
    RouterLink
  ],
  templateUrl: './community-archive.component.html',
  styleUrl: './community-archive.component.scss'
})

export class CommunityArchiveComponent implements OnInit{
  communityChallenge: CommunityChallengeArchive | any;

  columns: string[] = ['Username', 'Contributions'];

  constructor(private archiveService: ArchiveService) { }

  ngOnInit(): void {
    this.loadCommunityChallenge(null);
  }

  private loadCommunityChallenge(id: string | null) {
    this.archiveService.getPastCommunityChallenges(id).subscribe(result => {
      this.communityChallenge = result;
    })
  }

  getTypeSuffix(conditionType: any) {
    switch (conditionType) {
      case ConditionType.Height:
        return `M`
      case ConditionType.KOs:
        return `KO's`
      case ConditionType.Quads:
        return `Quads`
      case ConditionType.Spins:
        return `Spins`
      case ConditionType.AllClears:
        return `All Clears`
      case ConditionType.Apm:
        return `APM`
      case ConditionType.Pps:
        return `PPS`
      case ConditionType.Vs:
        return `VS`
    }

    return "";
  }

  conditionTypeString(conditionType: any) {
    switch(conditionType){
      case ConditionType.KOs:
        return 'KO\'s';
      case ConditionType.Height:
        return 'Altitude';
      case ConditionType.Quads:
        return 'Quads';
      case ConditionType.Spins:
        return 'Spins';
      case ConditionType.AllClears:
        return 'All Clears';
      case ConditionType.Apm:
        return 'APM';
      case ConditionType.Pps:
        return 'PPS';
      case ConditionType.Vs:
        return 'VS';
      case ConditionType.Finesse:
        return 'FINESSE';
      case ConditionType.Back2Back:
        return 'Back2Back';
      default:
        return []
    }
  }

  goToPage(id: any) {
    if(id == null) return;

    this.loadCommunityChallenge(id);
  }
}
