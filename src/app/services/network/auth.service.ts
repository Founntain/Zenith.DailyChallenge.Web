import {inject, Injectable, Service} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserProfileData} from './data/interfaces/UserProfileData';

@Service()
export class AuthService {
  baseUrl = environment.apiUrl + '/auth/';

  private readonly http = inject(HttpClient);

  constructor() { }

  isUserAuthorized(): Observable<UserProfileData>{
    return this.http.post<UserProfileData>(`${this.baseUrl}`, {}, { withCredentials: true });
  }

  logout(): Observable<UserProfileData>{
    return this.http.post<UserProfileData>(`${this.baseUrl}logout`, {}, { withCredentials: true });
  }
}
