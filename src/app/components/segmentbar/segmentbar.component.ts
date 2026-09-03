import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

import {MatTooltip} from '@angular/material/tooltip';

export interface BarSegmet{
  percent: number;
  color: string;
  label: string | null;
}

@Component({
  selector: 'app-segmentbar',
  imports: [
    MatTooltip
],
  templateUrl: './segmentbar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './segmentbar.component.scss'
})
export class SegmentbarComponent {
  @Input() segments: BarSegmet[] = [];
}
