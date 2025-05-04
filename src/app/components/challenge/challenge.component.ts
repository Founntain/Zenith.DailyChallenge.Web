import {Component, Input, input, OnChanges, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {DailyChallenge} from '../../services/network/data/interfaces/DailyChallenge';
import {ConditionType} from '../../services/network/data/enums/ConditionType';
import {Difficulty} from '../../services/network/data/enums/Difficulty';

@Component({
  selector: 'app-challenge',
  imports: [
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent implements OnChanges{
  @Input() challenge!: DailyChallenge;
  @Input() isCompleted!: boolean;

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
      this.difficultyTextLetters = this.difficultyText.split('');
      this.animateWave();
    }
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


  getDifficultyText(difficulty: number, getCssClass = false): string{
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
        if(getCssClass) return `Reverse`;

        switch(this.challenge.mods){
          case "expert_reversed": return "The Tyrant";
          case "nohold_reversed": return "Asceticism";
          case "messy_reversed": return "Loaded Dice";
          case "gravity_reversed": return "Freefall";
          case "volatile_reversed": return "Last Stand";
          case "doublehole_reversed": return "Damnation";
          case "invisible_reversed": return "The Exile";
          case "allspin_reversed": return "The Warlock";
          default: return ""
        }

      default:
          return "";
    }
  }

  getReverseFlavorText(): string{
    switch (this.challenge.mods) {
      case "expert_reversed": return "Fear, Oppression, And Limitless Ambition";
      case "nohold_reversed": return "A Detachment From Even That Which Is Moderate";
      case "messy_reversed": return "In A Rigged Game, Your Mind Is The Only Fair Adventage";
      case "gravity_reversed": return "The Ground You Stood On Never Existed In The First Place";
      case "volatile_reversed": return "Strength Isn't Necessary For Those With Nothing To Lose";
      case "doublehole_reversed": return "Neither The Freedom Of Life Or Peace Of Death";
      case "invisible_reversed": return "Never Underestimate Blind Faith";
      case "allspin_reversed": return "Into Realms Beyond Heaven And Earth";
      default: return ""
    }
  }

  getModImage(mod: string) {
    return `/assets/tetrio-img/mods/${mod}.png`;
  }

  getModArray(mods: string) {
    if (mods?.length === 0) return [];

    return mods.split(' ');
  }

  animateWave() {
    const spans = document.querySelectorAll('.reverseTitle span');
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTime) / 1000; // Seconds

      spans.forEach((span, i) => {
        // Horizontal (±4px) and Vertical (±8px) movement (4s cycle)
        const xPos = Math.sin(elapsed * Math.PI / 2 + i * 0.4) * 4;
        const yPos = Math.sin(elapsed * Math.PI / 2 + i * 0.4) * 8;

        // Rotation (±5deg, 8s cycle)
        const rotation = Math.sin(elapsed * Math.PI / 4 + i * 0.2) * 5;

        (span as HTMLElement).style.transform = `
          translateX(${xPos}px) 
          translateY(${yPos}px) 
          rotate(${rotation}deg)
        `;
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}
}
