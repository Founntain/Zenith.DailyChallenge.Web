import {Component, OnInit} from '@angular/core';
import {ZenithService} from '../../services/network/zenith.service';
import {ServerStatistics} from '../../services/network/data/interfaces/ServerStatistics';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {DailyHelper} from '../../util/DailyHelper';

@Component({
  selector: 'app-zdc-stats',
  imports: [
    MatIcon,
    MatTooltip
  ],
  templateUrl: './zdc-stats.component.html',
  styleUrl: './zdc-stats.component.scss'
})
export class ZdcStatsComponent implements OnInit{
  serverStatistics: ServerStatistics | undefined;
  mods:string[] = ['noMod', 'expert', 'noHold', 'messy', 'gravity', 'volatile', 'doubleHole', 'invisible', 'allSpin']

  constructor(
    private readonly zenithService: ZenithService,
  ) {}

  ngOnInit(): void {
    this.zenithService.getServerStatistics().subscribe(result => {
      this.serverStatistics = result;
    })
  }
}
