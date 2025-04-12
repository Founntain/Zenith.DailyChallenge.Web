import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserProfileData} from './data/interfaces/UserProfileData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + '/auth/';

  constructor(private http: HttpClient) { }

  isUserAuthorized(): Observable<UserProfileData>{
    return this.http.post<UserProfileData>(`${this.baseUrl}`, {}, { withCredentials: true });
  }
}
