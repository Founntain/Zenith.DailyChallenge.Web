import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [
    MatTooltip,
    MatIcon
  ],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
