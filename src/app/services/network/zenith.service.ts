import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DailyChallenge} from './data/interfaces/DailyChallenge';

@Injectable({
  providedIn: 'root'
})
export class ZenithService {

  baseUrl = environment.apiUrl + '/zenith/';

  constructor(private http: HttpClient) { }

  getDates(): Observable<any>{
    return this.http.get<any>(this.baseUrl + 'daily/date');
  }

  getDailyChallenges(): Observable<DailyChallenge[]>{
    return this.http.get<DailyChallenge[]>(this.baseUrl + 'daily');
  }

  submitRuns(): Observable<any>{
    return this.http.post(this.baseUrl + 'daily/submit',{}, { withCredentials: true });
  }
}
