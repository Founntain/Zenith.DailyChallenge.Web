import {Component, OnInit} from '@angular/core';
import {ZenithService} from '../../services/network/zenith.service';
import {ServerStatistics} from '../../services/network/data/interfaces/ServerStatistics';

@Component({
  selector: 'app-zdc-stats',
  imports: [],
  templateUrl: './zdc-stats.component.html',
  styleUrl: './zdc-stats.component.scss'
})
export class ZdcStatsComponent implements OnInit{
  serverStatistics: ServerStatistics | undefined;

  constructor(
    private readonly zenithService: ZenithService,
  ) {}

  ngOnInit(): void {
    this.zenithService.getServerStatistics().subscribe(result => {
      this.serverStatistics = result;
    })
  }
}
