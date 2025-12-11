import {Component, Input, input, OnChanges, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {Difficulty} from '../../services/network/data/enums/Difficulty';
import {ChallengeHelper} from '../../util/ChallengeHelper';

@Component({
  selector: 'app-challenge',
  imports: [
    NgClass,
  ],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent implements OnChanges{
  @Input() challenge!: DailyChallenge;
  @Input() isCompleted!: boolean;

  challengeHelper: ChallengeHelper = new ChallengeHelper();

  difficultyText: string = "";
  difficultCssClass: string = "";
  reverseText: string = "";
  processedConditions: { prefix: string; value: string, suffix: string }[] = [];
  modImages: string[] = [];

  ngOnChanges(): void {
    this.difficultyText = this.getDifficultyText(this.challenge.points);
    this.difficultCssClass = this.getDifficultyText(this.challenge.points, true);

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


    if(this.difficultCssClass === "Reverse"){
      this.reverseText = this.getReverseFlavorText();
    }
  }

  getConditionText(type: number, value: number): string{
    return this.challengeHelper.getConditionText(type, value);
  }

  getPrefix(type: number): string{
    return this.challengeHelper.getPrefix(type);
  }

  getValue(type: number, value: number):any []{
    return this.challengeHelper.getValue(type, value);
  }


  getDifficultyText(difficulty: number, getCssClass = false): string{
    return this.challengeHelper.getDifficultyText(difficulty, this.challenge.mods, getCssClass);
  }

  getReverseFlavorText(): string{
    return this.challengeHelper.getReverseFlavorText(this.challenge.mods);
  }

  getModImage(mod: string) {
    return `/assets/tetrio-img/mods/${mod}.png`;
  }

  getModArray(mods: string) {
    if (mods?.length === 0) return [];

    return mods.split(' ');
  }

  protected readonly Difficulty = Difficulty;
}
