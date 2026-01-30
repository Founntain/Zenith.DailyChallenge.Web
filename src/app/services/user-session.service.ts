// user-session.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {UserProfileData} from './network/data/interfaces/UserProfileData';

@Injectable({ providedIn: 'root' })
export class UserSessionService {
  private readonly _user$ = new BehaviorSubject<UserProfileData | null>(null);

  readonly user$ = this._user$.asObservable();

  setUser(user: UserProfileData | null) {
    this._user$.next(user);
  }

  get snapshot(): UserProfileData | null {
    return this._user$.value;
  }
}
