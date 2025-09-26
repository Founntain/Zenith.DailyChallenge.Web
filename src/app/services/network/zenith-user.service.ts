import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {DailyChallenge} from './data/interfaces/DailyChallenge';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserProfileData} from './data/interfaces/UserProfileData';
import {Overlay} from '@angular/cdk/overlay';
import {DailyData} from './data/interfaces/DailyData';
import {Run} from './data/interfaces/Run';
import {ChallengeCompletion} from './data/interfaces/ChallengeCompletion';
import {CommunityChallengeContributions} from './data/interfaces/CommunityChallengeContributions';
import {TodayCompletions} from './data/interfaces/TodayCompletions';
import {ZenithSplits} from './data/interfaces/ZenithSplits';
import {DailyExtra} from './data/interfaces/DailyExtra';

@Injectable({
  providedIn: 'root'
})
export class ZenithUserService {
  baseUrl = environment.apiUrl + '/zenithUser/';

  constructor(private http: HttpClient) { }

  getProfile(username: string): Observable<UserProfileData>{
    return this.http.get<UserProfileData>(`${this.baseUrl}${username}/profile`);
  }

  getDaily(username: string): Observable<DailyData>{
    return this.http.get<DailyData>(`${this.baseUrl}${username}/daily`);
  }

  getDailyExtra(username: string, progressionLimit: number = 100): Observable<DailyExtra>{
    return this.http.get<DailyExtra>(`${this.baseUrl}${username}/dailyExtra?progressionLimit=${progressionLimit}`);
  }

  getRuns(username: string, page: number, pageSize: number): Observable<Run[]>{
    return this.http.get<Run[]>(`${this.baseUrl}${username}/runs?page=${page}&pageSize=${pageSize}`);
  }

  getBestSplits(username: string, mod: string | null = null, soloMod: boolean = false ): Observable<ZenithSplits> {
    if(mod == null)
      return this.http.get<ZenithSplits>(`${this.baseUrl}${username}/bestSplits?soloMod=${soloMod}`)
    else
      return this.http.get<ZenithSplits>(`${this.baseUrl}${username}/bestSplits?mod=${mod}&soloMod=${soloMod}`);
  }

  getSplits(username: string, page: number = 0, pageSize: number = 100) {
    return this.http.get<any[]>(`${this.baseUrl}${username}/splits?page=${page}&pageSize=${pageSize}`);
  }

  getCommunityContributions(username: string, page: number, pageSize: number): Observable<CommunityChallengeContributions[]>{
    return this.http.get<CommunityChallengeContributions[]>(`${this.baseUrl}${username}/getCommunityContributions?page=${page}&pageSize=${pageSize}`);
  }

  getChallenges(username: string, page: number, pageSize: number): Observable<DailyChallenge[]>{
    return this.http.get<DailyChallenge[]>(`${this.baseUrl}${username}/challenges?page=${page}&pageSize=${pageSize}`);
  }

  getTodaysChallengeCompletions(username: string): Observable<TodayCompletions>{
    return this.http.get<TodayCompletions>(`${this.baseUrl}${username}/getTodaysChallengeCompletions`);
  }

  getChallengeCompletions(username: string, page: number, pageSize: number): Observable<ChallengeCompletion[]>{
    return this.http.get<ChallengeCompletion[]>(`${this.baseUrl}${username}/challengeCompletions?page=${page}&pageSize=${pageSize}`);
  }
}
