import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {ZenithService} from '../../services/network/zenith.service';
import {ServerStatistics} from '../../services/network/data/interfaces/ServerStatistics';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-zdc-stats',
  imports: [
    MatIcon,
    MatTooltip
  ],
  templateUrl: './zdc-stats.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './zdc-stats.component.scss'
})
export class ZdcStatsComponent{
  private readonly zenithService = inject(ZenithService);

  serverStatistics = rxResource({
    stream: () => this.zenithService.getServerStatistics().pipe(map(res => res as ServerStatistics))
  })
  mods:string[] = ['noMod', 'expert', 'noHold', 'messy', 'gravity', 'volatile', 'doubleHole', 'invisible', 'allSpin']
}
