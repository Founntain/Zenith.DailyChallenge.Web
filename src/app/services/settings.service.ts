import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private autoUpdate;
  public autoUpdate$: Observable<boolean>;

  constructor() {
    if (typeof localStorage === 'undefined'){
      this.autoUpdate = new BehaviorSubject<boolean>(false);
    }else{
      this.autoUpdate = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('autoUpdate') ?? 'false'));
    }

    this.autoUpdate$ = this.autoUpdate.asObservable();
  }

  setAutoUpdate(value: boolean){
    localStorage.setItem('autoUpdate', JSON.stringify(value));
    this.autoUpdate.next(value);
  }
}
