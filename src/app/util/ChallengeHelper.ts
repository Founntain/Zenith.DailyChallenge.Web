import {ConditionType} from '../services/network/data/enums/ConditionType';
import {Difficulty} from '../services/network/data/enums/Difficulty';

export class ChallengeHelper {
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
      case ConditionType.Back2Back:
        return `Obtain ${value} Back2Back`;
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
      case ConditionType.Back2Back:
        return `Obtain`;
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
      case ConditionType.Back2Back:
        return [value, ' B2B'];
      default:
        return []
    }
  }

  getDifficultyText(difficulty: number, mods:string, getCssClass = false): string{
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

        switch(mods){
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

  getReverseFlavorText(mods: string): string{
    switch (mods) {
      case "expert_reversed": return "Fear, Oppression, And Limitless Ambition";
      case "nohold_reversed": return "A Detachment From Even That Which Is Moderate";
      case "messy_reversed": return "In A Rigged Game, Your Mind Is The Only Fair Advantage";
      case "gravity_reversed": return "The Ground You Stood On Never Existed In The First Place";
      case "volatile_reversed": return "Strength Isn't Necessary For Those With Nothing To Lose";
      case "doublehole_reversed": return "Neither The Freedom Of Life Or Peace Of Death";
      case "invisible_reversed": return "Never Underestimate Blind Faith";
      case "allspin_reversed": return "Into Realms Beyond Heaven And Earth";
      default: return ""
    }
  }
}
