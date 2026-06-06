import {Component, Input, OnInit} from '@angular/core';
import {ZenithSplits} from '../../services/network/data/interfaces/ZenithSplits';
import {ZenithUserService} from '../../services/network/zenith-user.service';
import {MatChipAvatar, MatChipListbox, MatChipOption} from '@angular/material/chips';
import {Splits} from '../../services/network/data/interfaces/Splits';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-zenith-splits',
  imports: [
    MatChipListbox,
    MatChipOption,
    MatIcon,
    MatChipAvatar,
    RouterLink
  ],
  templateUrl: './zenith-splits.component.html',
  styleUrl: './zenith-splits.component.scss'
})
export class ZenithSplitsComponent implements OnInit{
  @Input() username: string = "";

  splitTimes!: ZenithSplits;

  floors: (keyof Splits)[] = ['hotel', 'casino', 'arena', 'museum', 'offices', 'laboratory', 'core', 'corruption', 'potg'];
  splitMods:string[] =  ['nomod', 'expert', 'nohold', 'messy', 'gravity', 'volatile', 'doublehole', 'invisible', 'allspin', 'expert_reversed', 'nohold_reversed', 'messy_reversed', 'gravity_reversed', 'volatile_reversed', 'doublehole_reversed', 'invisible_reversed', 'allspin_reversed']
  splitModsText: string[] = ['No Mod', 'Expert', 'No Hold', 'Messy', 'Gravity', 'Volatile', 'Double Hole', 'Invisible', 'All Spin', 'The Tyrant', 'Asceticism', 'Loaded Dice', 'Freefall', 'Last Stand', 'Damnation', 'The Exile', 'The Warlock']

  constructor(private userService: ZenithUserService) {
  }

  ngOnInit(): void {
    this.loadSplitTimes(null, false);
  }

  private loadSplitTimes(mod: string | any, soloMod: boolean) {
    this.userService.getBestSplits(this.username, mod, soloMod).subscribe(result => {
      this.splitTimes = result;
    });
  }

  isNotEmptyTime(time: string) {
    return time != '00:00.000';
  }

  getFloorReachedCss(time: any) {
    if(!this.isNotEmptyTime(time)){
      return 'notReached';
    }else{
      return '';
    }
  }

  getModImageFromModList(mod: string) {
    return mod.toLowerCase().replace(/\s+/g, "");
  }

  getSplitText(time: any, average = false) {
    if(this.isNotEmptyTime(time)){
      return time;
    }else{
      if(average){
        return 'Not reached yet';
      }
      return '';
    }
  }

  onSplitFilterChanged(event: any) {
    let selectedValue: string;

    if(event.value === undefined)
      selectedValue = '';
    else
      selectedValue = this.getModImageFromModList(event.value)

    this.loadSplitTimes(selectedValue, false);
  }
}
