import {Component, OnInit, ChangeDetectionStrategy, inject, signal} from '@angular/core';
import {ArchiveService} from '../../services/network/archive.service';
import {CommunityChallengeArchive} from '../../services/network/data/interfaces/CommunityChallengeArchive';
import {RouterLink} from '@angular/router';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {MatIcon} from '@angular/material/icon';
import {MatRipple} from '@angular/material/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {map} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-community-archive',
  imports: [
    MatIcon,
    MatRipple,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    RouterLink
  ],
  templateUrl: './community-archive.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './community-archive.component.scss'
})

export class CommunityArchiveComponent{
  private readonly archiveService = inject(ArchiveService);

  protected communityChallengeId = signal<string | null>(null);

  communityChallenge = rxResource({
    params: () => ({ id: this.communityChallengeId() }),
    stream: ({ params }: { params: { id: string | null } }) => {
      return this.archiveService.getPastCommunityChallenges(params.id).pipe(map(res => res as CommunityChallengeArchive | any))
    }
  })

  columns: string[] = ['Username', 'Contributions'];

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
      case ConditionType.TotalBonus:
        return 'Bonus';
    }

    return "";
  }

  goToPage(id: any) {
    if(id == null) return;

    this.communityChallengeId.set(id);
  }
}
