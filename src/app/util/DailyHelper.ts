import {Splits} from '../services/network/data/interfaces/Splits';
import {NumberUtils} from './NumberUtils';

export class DailyHelper {
  public static floors: (keyof Splits)[] = ['hotel', 'casino', 'arena', 'museum', 'offices', 'laboratory', 'core', 'corruption', 'potg'];
  public static allFloors: string[] = ['hob', 'hotel', 'casino', 'arena', 'museum', 'offices', 'laboratory', 'core', 'corruption', 'potg'];
  public static allFloorFullNames: string[] = ['Hall of Beginnings', 'The Hotel', 'The Casino', 'The Arena', 'The Museum', 'Abandoned Offices', 'The Laboratory', 'The Core', 'Corruption', 'Platform of the Gods'];
  public static floorColors: string[] = ['rgba(255, 135, 92, 0.8)', 'rgba(253, 230, 146, 0.8)', 'rgba(255, 199, 136, 0.8)', 'rgba(255, 183, 194, 0.8)', 'rgba(255, 186, 67, 0.8)', 'rgba(255, 145, 123, 0.8)', 'rgba(0, 221, 255, 0.8)', 'rgba(255, 0, 111, 0.8)', 'rgba(152, 255, 178, 0.8)', 'rgba(214, 119, 255, 0.6)'];

  public static roundNumber(value: number, decimalPoints: number = 2){
    // if(value === undefined) return "0";

    return value.toFixed(decimalPoints).toLocaleString();
  }

  public static getFloorKey(floor: number){
    return this.allFloors[floor - 1];
  }

  public static getModArray(mods: string): string[]{
    if (mods?.length === 0) return [];

    return mods.split(' ');
  }

  public static getFloorLongName(floor: number){
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

  public static getFloorByAltitude(altitude: number){
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

  public static getModImageUrl(mod: string){
    return `/assets/tetrio-img/mods/${mod}.png`;
  }

  public static getLevelTagShape(level: number) {
    const parts = NumberUtils.splitInto4PlaceValues(level)

    let x = parts[1] >= 500 ? parts[1] - 500 : parts[1];

    return "lt_shape_" + Math.floor(x/ 100);
  }

  public static getLevelTagBadgeColor(level: number) {
    const parts = NumberUtils.splitInto4PlaceValues(level)
    const combinedParts = parts[0] + parts[1];

    return "lt_badge_color_" + Math.floor(combinedParts / 500);
  }

  public static getLevelTagShapeColor(level: number) {
    const parts = NumberUtils.splitInto4PlaceValues(level)
    const combinedParts = parts[2] + parts[3];


    return "lt_shape_color_" + Math.floor(combinedParts / 10);
  }
}
