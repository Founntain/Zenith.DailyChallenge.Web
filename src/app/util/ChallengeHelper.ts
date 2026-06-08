import {ConditionType, WeeklyConditionType} from '../services/network/data/enums/ConditionType';
import {Difficulty} from '../services/network/data/enums/Difficulty';

export class ChallengeHelper {
  public static getConditionText(type: number, value: number): string{
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

  public static getPrefix(type: number): string{
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
      case ConditionType.App:
        return `Get`;
      case ConditionType.Lines:
        return `Clear`;
      default:
        return ""
    }
  }

  public static getWeeklyPrefix(type: number): string{
    switch(type){
      case WeeklyConditionType.Height:
        return `Accumulate`;
      case WeeklyConditionType.KOs:
        return `Eliminate`;
      case WeeklyConditionType.Quads:
        return `Clear`;
      case WeeklyConditionType.Spins:
        return `Clear`;
      case WeeklyConditionType.AllClears:
        return `Get`;
      case WeeklyConditionType.BackToBack:
        return `Get`;
      case WeeklyConditionType.TotalBonus:
        return `Achieve`;
      case WeeklyConditionType.LinesCleared:
        return `Clear`;
      case WeeklyConditionType.GarbageSent:
        return `Send`;
      case WeeklyConditionType.GarbageCleared:
        return `Clear`;
      default:
        return ""
    }
  }

  public static getWeeklySuffix(type: number): string{
    switch(type){
      case WeeklyConditionType.Height:
        return `M`;
      case WeeklyConditionType.KOs:
        return `Players`;
      case WeeklyConditionType.Quads:
        return `Quads`;
      case WeeklyConditionType.Spins:
        return `Spins`;
      case WeeklyConditionType.AllClears:
        return `AllClears`;
      case WeeklyConditionType.BackToBack:
        return `B2B`;
      case WeeklyConditionType.TotalBonus:
        return `Bonus`;
      case WeeklyConditionType.LinesCleared:
        return `Lines`;
      case WeeklyConditionType.GarbageSent:
      case WeeklyConditionType.GarbageCleared:
        return `Garbage`;
      default:
        return ""
    }
  }

  public static getValue(type: number, value: number):any []{
    switch(type){
      case ConditionType.KOs:
        return [value, ' KO\'s'];
      case ConditionType.Height:
        return [value, 'Altitude'];
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
        return [value, ' Back 2 Back'];
      case ConditionType.App:
        return [value, ' APP'];
      case ConditionType.Lines:
        return [value, ' Lines'];
      default:
        return []
    }
  }

  public static getDifficultyText(difficulty: number, mods:string, getCssClass = false): string{
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

  public static getReverseFlavorText(mods: string): string{
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

  public static getStatFromCondition(conditionType: ConditionType, value: number | string): any {
    const conditionMap: Record<ConditionType, Omit<any, 'value'> & { formatter?: (val: number | string) => string }> = {
      [ConditionType.Height]: {
        icon: 'trending_up',
        label: 'M',
        formatter: (val) => `Reach ${val.toLocaleString()} M`
      },
      [ConditionType.KOs]: {
        icon: 'close',
        label: 'KOs',
        formatter: (val) => `${val}`
      },
      [ConditionType.Quads]: {
        icon: 'grid_4x4',
        label: 'Quads',
        formatter: (val) => `${val} Quads`
      },
      [ConditionType.Spins]: {
        icon: 'refresh',
        label: 'Spins',
        formatter: (val) => `${val} Spins`
      },
      [ConditionType.AllClears]: {
        icon: 'check_circle',
        label: 'All Clears',
        formatter: (val) => `${val} All Clears`
      },
      [ConditionType.Apm]: {
        icon: 'speed',
        label: 'APM',
        formatter: (val) => `${val} APM`
      },
      [ConditionType.Pps]: {
        icon: 'bolt',
        label: 'PPS',
        formatter: (val) => `${val} PPS`
      },
      [ConditionType.Vs]: {
        icon: 'sports_esports',
        label: 'VS',
        formatter: (val) => `${Number(val).toLocaleString()} VS`
      },
      [ConditionType.Finesse]: {
        icon: 'verified',
        label: '% Finesse',
        formatter: (val) => `${val}% Finesse`
      },
      [ConditionType.Back2Back]: {
        icon: 'repeat',
        label: 'B2B',
        formatter: (val) => `${val} B2B`
      },
      [ConditionType.TotalBonus]: {
        icon: 'stars',
        label: 'Total Bonus',
        formatter: (val) => `${Number(val).toLocaleString()} Bonus`
      },
      [ConditionType.App]: {
        icon: 'filter_9_plus',
        label: 'APP',
        formatter: (val) => `${val} APP`
      },
      [ConditionType.Lines]: {
        icon: 'view_stream',
        label: 'Lines cleared',
        formatter: (val) => `${val} Lines`
      }
    };

    const config = conditionMap[conditionType];

    if (!config) {
      // Fallback for unknown condition types
      return {
        icon: 'help_outline',
        value: String(value),
        label: 'Unknown'
      };
    }

    return {
      icon: config['icon'],
      value: config.formatter ? config.formatter(value) : String(value),
      label: config['label']
    };
  }
}
