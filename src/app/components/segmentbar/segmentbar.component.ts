import {Component, Input} from '@angular/core';
import {NgForOf} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';

export interface BarSegmet{
  percent: number;
  color: string;
  label: string | null;
}

@Component({
  selector: 'app-segmentbar',
  imports: [
    NgForOf,
    MatTooltip
  ],
  templateUrl: './segmentbar.component.html',
  styleUrl: './segmentbar.component.scss'
})
export class SegmentbarComponent {
  @Input() segments: BarSegmet[] = [];
}
