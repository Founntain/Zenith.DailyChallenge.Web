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
        return `Get ${value} KO's`;
      case ConditionType.Height:
        return `Reach ${value}M`;
      case ConditionType.Quads:
        return `Clear ${value} Quads`;
      case ConditionType.Spins:
        return `Clear ${value} Spins`;
      case ConditionType.AllClears:
        return `Get ${value} All Clears`;
      case ConditionType.Apm:
        return `Get ${value} APM`;
      case ConditionType.Pps:
        return `Get ${value} PPS`;
      case ConditionType.Vs:
        return `Get ${value} VS`;
      case ConditionType.Finesse:
        return `Get ${value}% Finesse`;
      default:
        return ""
    }
  }

  getPrefix(type: number): string{
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
      case ConditionType.Apm:
        return `Get`;
      case ConditionType.Pps:
        return `Get`;
      case ConditionType.Vs:
        return `Get`;
      case ConditionType.Finesse:
        return `Achieve`;
      default:
        return ""
    }
  }

  getValue(type: number, value: number):any []{
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
      case ConditionType.Apm:
        return [value, ' APM'];
      case ConditionType.Pps:
        return [value, ' PPS'];
      case ConditionType.Vs:
        return [value, ' VS'];
      case ConditionType.Finesse:
        return [value, '% FINESSE'];
      default:
        return []
    }
  }

  getDifficultyText(difficulty: number): string{
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
      case Difficulty.Reverse:
        return "Reverse";
      default:
          return "";
    }
  }

  getModImage(mod: string) {
    return `/assets/tetrio-img/mods/${mod}.png`;
  }

  getModArray(mods: string) {
    if (mods?.length === 0) return [];

    return mods.split(' ');
  }
}
