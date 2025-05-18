import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private autoUpdate = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('autoUpdate') ?? 'false'));
  public autoUpdate$ = this.autoUpdate.asObservable();

  constructor() { }

  setAutoUpdate(value: boolean){
    localStorage.setItem('autoUpdate', JSON.stringify(value));
    this.autoUpdate.next(value);
  }
}
