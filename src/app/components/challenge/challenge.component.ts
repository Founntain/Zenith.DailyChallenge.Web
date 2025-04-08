import {Component, Input, input, OnChanges, OnInit} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {Difficulty} from '../../services/network/data/enums/Difficulty';

@Component({
  selector: 'app-challenge',
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent implements OnChanges{
  @Input() challenge!: DailyChallenge;

  difficultyText: string = "";
  processedConditions: { prefix: string; value: string, suffix: string }[] = [];
  modImages: string[] = [];


  ngOnChanges(): void {
    this.difficultyText = this.getDifficultyText(this.challenge.points);

    if (this.challenge.conditions) {
      this.challenge.conditions.sort((a, b) => a.type - b.type);

      this.processedConditions = this.challenge.conditions.map(condition => {

        let result:any = {};

        result.prefix = this.getPrefix(condition.type);

        let v = this.getValue(condition.type, condition.value);

        result.value = v[0];
        result.suffix = v[1];

        return result;
      });
    }

    this.modImages = this.getModArray(this.challenge.mods).map(mod => this.getModImage(mod));
  }

  getConditionText(type: number, value: number): string{
    switch(type){
      case ConditionType.KOs:
        return `Get ${value} KOs`;
      case ConditionType.Height:
        return `Reach ${value}M`;
      case ConditionType.Quads:
        return `Clear ${value} Quads`;
      case ConditionType.Spins:
        return `Clear ${value} Spins`;
      case ConditionType.AllClears:
        return `Get ${value} All Clears`;
      default:
        return ""
    }
  }

  getPrefix(type: number): string{
    console.log('C P', type)

    switch(type){
      case ConditionType.KOs:
        return `Get`;
      case ConditionType.Height:
        return `Reach`;
      case ConditionType.Quads:
        return `Clear`;
      case ConditionType.Spins:
        return `Clear`;
      case ConditionType.AllClears:
        return `Get`;
      default:
        return ""
    }
  }

  getValue(type: number, value: number):any []{
    console.log('C V', type, value)

    switch(type){
      case ConditionType.KOs:
        return [value, ' KOs'];
      case ConditionType.Height:
        return [value, 'M'];
      case ConditionType.Quads:
        return [value, ' Quads'];
      case ConditionType.Spins:
        return [value, ' Spins'];
      case ConditionType.AllClears:
        return [value, ' All Clears'];
      default:
        return []
    }
  }

  getDifficultyText(difficulty: number): string{
    console.log('C D', difficulty)

    switch(difficulty){
      case Difficulty.VeryEasy:
        return "Very Easy";
      case Difficulty.Easy:
        return "Easy";
      case Difficulty.Normal:
        return "Normal";
      case Difficulty.Hard:
        return "Hard";
      case Difficulty.Expert:
        return "Expert";
      default:
          return "";
    }
  }

  getModImage(mod: string) {
    console.log('C MI', mod)

    return `/assets/tetrio-img/mods/${mod}.png`;
  }

  getModArray(mods: string) {
    console.log('C MA', mods)

    if (mods?.length === 0) return [];

    return mods.split(' ');
  }
}
