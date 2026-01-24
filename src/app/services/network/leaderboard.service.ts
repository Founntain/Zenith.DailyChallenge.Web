import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserProfileData} from './data/interfaces/UserProfileData';
import {environment} from '../../../environments/environment';
import {GlobalLeaderboard, SeasonalLeaderboard, SeasonalPlacement} from './data/interfaces/GlobalLeaderboard';
import {DailyChallengeArchive} from './data/interfaces/DailyChallengeArchive';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  baseUrl = environment.apiUrl + '/leaderboard';

  constructor(private http: HttpClient) { }

  getLeaderboard(date: any = null): Observable<SeasonalLeaderboard>{
    if (date == null) return this.http.get<SeasonalLeaderboard>(`${this.baseUrl}`);

    return this.http.get<SeasonalLeaderboard>(`${this.baseUrl}?date=${date}`);
  }

  getLeaderboardPosition(username: string): Observable<SeasonalPlacement>{
    return this.http.get<SeasonalPlacement>(`${this.baseUrl}/${username}`);
  }

  getGlobalLeaderboard(page:number = 1, pageSize:number = 30): Observable<GlobalLeaderboard>{
    return this.http.get<GlobalLeaderboard>(this.baseUrl + `/getGlobalLeaderboard?page=${page}&pageSize=${pageSize}`);
  }

  getLegacyLeaderboard(page:number = 1, pageSize:number = 30): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + `/getLegacyLeaderboard`);
  }
}
