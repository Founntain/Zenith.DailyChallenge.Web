import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DailyChallenge} from './data/interfaces/DailyChallenge';
import {DailyLeaderboard} from './data/interfaces/DailyLeaderboard';
import {CommunityChallenge} from './data/interfaces/CommunityChallenge';
import {RecentCommunityContribution} from './data/interfaces/RecentCommunityContribution';
import {ServerStatistics} from './data/interfaces/ServerStatistics';

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

  getLeaderboard(page:number = 1, pageSize:number = 30): Observable<DailyLeaderboard>{
    return this.http.get<DailyLeaderboard>(this.baseUrl + `daily/getLeaderboard?page=${page}&pageSize=${pageSize}`);
  }

  getCommunityChallenge(): Observable<CommunityChallenge>{
    return this.http.get<CommunityChallenge>(this.baseUrl + 'daily/getCommunityChallenge');
  }

  getRecentCommunityContributions(): Observable<RecentCommunityContribution[]>{
    return this.http.get<RecentCommunityContribution[]>(this.baseUrl + 'daily/getRecentCommunityContributions');
  }

  getSplitLeaderboard(): Observable<DailyChallenge[]>{
    return this.http.get<DailyChallenge[]>(this.baseUrl + 'daily/getSplitLeaderboard');
  }

  getServerStatistics(): Observable<ServerStatistics>{
    return this.http.get<ServerStatistics>(this.baseUrl + 'daily/getServerStatistics');
  }

  submitRuns(): Observable<any>{
    return this.http.post(this.baseUrl + 'daily/submit', {}, { withCredentials: true });
  }
}
