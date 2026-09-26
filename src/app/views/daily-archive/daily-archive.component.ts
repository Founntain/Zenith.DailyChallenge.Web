import {MatFormFieldModule} from '@angular/material/form-field';
import {NgClass} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import {DailyChallengeArchive} from '../../services/network/data/interfaces/DailyChallengeArchive';
import {ChallengeHelper} from '../../util/ChallengeHelper';
import {ArchiveService} from '../../services/network/archive.service';
import {Difficulty} from '../../services/network/data/enums/Difficulty';
import {Component, ChangeDetectionStrategy, inject, signal, computed} from '@angular/core';
import {map, min} from 'rxjs';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-daily-archive',
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltip,
    RouterLink,
    MatProgressSpinner,
    MatProgressBar,
  ],
  providers: [
    provideNativeDateAdapter(),
  ],
  templateUrl: './daily-archive.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './daily-archive.component.scss'
})

export class DailyArchiveComponent {
  private readonly archiveService = inject(ArchiveService);

  selectedDate = signal<string | null>(null);

  archiveData = rxResource({
    params: () => ({date: this.selectedDate()}),
    stream: ({ params }: { params: { date: string | null } }) => {
      return this.archiveService.getPastDailyChallenges(params.date).pipe(map(res => res as DailyChallengeArchive[]))
    }
  })

  minDate = computed(() => {
    if(!this.archiveData.hasValue()) return null;

    return this.archiveData.value()[0].minDate;
  })

  maxDate = computed(() => {
    if(!this.archiveData.hasValue()) return null;

    return this.archiveData.value()[0].maxDate;
  })

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
  getValue(type: number, value: number):any []{
    return ChallengeHelper.getValue(type, value);
  }

  getDifficultyText(difficulty: number, mods: string, getCssClass = false): string{
    return ChallengeHelper.getDifficultyText(difficulty, mods, getCssClass);
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

    this.selectedDate.set(dateString);
  }
}
