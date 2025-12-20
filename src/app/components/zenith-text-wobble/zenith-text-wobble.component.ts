import {Component, Input, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-zenith-text-wobble',
  imports: [
    NgForOf
  ],
  templateUrl: './zenith-text-wobble.component.html',
  styleUrl: './zenith-text-wobble.component.scss'
})
export class ZenithTextWobbleComponent implements OnInit {
  @Input() text: string = '';
  @Input() upperCase: boolean = false;

  stableSplitTitle: any[] = [];

  ngOnInit(): void {
    this.text = this.upperCase ? this.text.toUpperCase() : this.text;

    this.generateTitle();
  }

  // Use ngOnChanges to regenerate if the input text changes
  ngOnChanges(): void {
    this.generateTitle();
  }

  generateTitle() {
    if (!this.text) return;

    this.stableSplitTitle = this.text.split('').map((char, index) => ({
      char: char === ' ' ? '\u00A0' : char,
      index,
      // Fixed values generated once per text change
      sa: (Math.random() * 2 + 3).toFixed(2) + 's',
      sb: (Math.random() * -10).toFixed(2) + 's'
    }));
  }
}
