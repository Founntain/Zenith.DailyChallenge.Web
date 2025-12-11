import {MatFormFieldModule} from '@angular/material/form-field';
import {NgClass} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import {DailyChallengeArchive} from '../../services/network/data/interfaces/DailyChallengeArchive';
import {ChallengeHelper} from '../../util/ChallengeHelper';
import {ArchiveService} from '../../services/network/archive.service';
import {Difficulty} from '../../services/network/data/enums/Difficulty';
import {Component} from '@angular/core';
import {min} from 'rxjs';

@Component({
  selector: 'app-daily-archive',
  imports: [
    NgClass,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    provideNativeDateAdapter(),
  ],
  templateUrl: './daily-archive.component.html',
  styleUrl: './daily-archive.component.scss'
})

export class DailyArchiveComponent {
  archiveData: DailyChallengeArchive[] = [];
  challengeHelper: ChallengeHelper = new ChallengeHelper();
  currentDate: any;
  minDate: any;
  maxDate: any;

  constructor(private archiveService: ArchiveService) {
    this.loadDailyChallengeFromServer(null)
  }

  protected loadDailyChallengeFromServer(date: any | null){

    this.archiveService.getPastDailyChallenges(date).subscribe(result => {
      this.archiveData = result;

      this.currentDate = this.archiveData[0].date;
      this.minDate = this.archiveData[0].minDate;
      this.maxDate = this.archiveData[0].maxDate;
    });
  }

  protected getDifficultyName(difficulty: Difficulty) {
    switch (difficulty) {
      case Difficulty.Easy: return 'Easy';
      case Difficulty.Normal: return 'Normal';
      case Difficulty.Hard: return 'Hard';
      case Difficulty.Expert: return 'Expert';
      case Difficulty.Reverse: return 'Reverse';
      default: return 'ERROR: Tell Founntain';
    }
  }

  protected getDifficultyCssClass(difficulty: Difficulty  ) {
    switch (difficulty) {
      case Difficulty.Easy: return 'easy';
      case Difficulty.Normal: return 'normal';
      case Difficulty.Hard: return 'hard';
      case Difficulty.Expert: return 'expert';
      case Difficulty.Reverse: return 'reverse';
      default: return '';
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

  getDifficultyText(difficulty: number, mods: string, getCssClass = false): string{
    return this.challengeHelper.getDifficultyText(difficulty, mods, getCssClass);
  }

  getReverseFlavorText(mods: string): string{
    return this.challengeHelper.getReverseFlavorText(mods);
  }

  getModImage(mod: string) {
    return `/assets/tetrio-img/mods/${mod}.png`;
  }

  protected isReverse(difficulty: Difficulty) {
   return difficulty == Difficulty.Reverse ? 'Reverse' : '';
  }

  protected readonly min = min;

  protected onDateChanged(value: any) {
    let date = value.value as Date;

    let dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

    this.loadDailyChallengeFromServer(dateString);
  }
}
