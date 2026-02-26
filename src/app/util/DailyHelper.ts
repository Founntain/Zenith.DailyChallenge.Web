import {Splits} from '../services/network/data/interfaces/Splits';

export class DailyHelper {
  floors: (keyof Splits)[] = ['hotel', 'casino', 'arena', 'museum', 'offices', 'laboratory', 'core', 'corruption', 'potg'];
  allFloors: string[] = ['hob', 'hotel', 'casino', 'arena', 'museum', 'offices', 'laboratory', 'core', 'corruption', 'potg'];

  roundNumber(value: number, decimalPoints: number = 2){
    // if(value === undefined) return "0";

    return value.toFixed(decimalPoints).toLocaleString();
  }

  getFloorKey(floor: number){
    return this.allFloors[floor - 1];
  }

  getFloorLongName(floor: number){
    switch(floor){
      case 1: return "Hall of Beginnings";
      case 2: return "The Hotel";
      case 3: return "The Casino";
      case 4: return "The Arena";
      case 5: return "The Museum";
      case 6: return "Abandoned Offices";
      case 7: return "The Laboratory";
      case 8: return "The Core";
      case 9: return "Corruption";
      case 10: return "Platform of the Gods";
      default: return "Unknown Abyss";
    }
  }

  getFloorByAltitude(altitude: number){
    if(altitude >= 1650) return 10;
    if(altitude < 1650 && altitude >= 1350) return 9;
    if(altitude < 1350 && altitude >= 1100) return 8;
    if(altitude < 1100 && altitude >= 850) return 7;
    if(altitude < 850 && altitude >= 650) return 6;
    if(altitude < 650 && altitude >= 450) return 5;
    if(altitude < 450 && altitude >= 350) return 4;
    if(altitude < 350 && altitude >= 150) return 3;
    if(altitude < 150 && altitude >= 50) return 2;
    if(altitude < 50) return 1;

    return 0;
  }

  getModImageUrl(mod: string){
    return `/assets/tetrio-img/mods/${mod}.png`;
  }
}
