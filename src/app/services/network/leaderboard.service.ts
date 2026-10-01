import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {GlobalLeaderboard, SeasonalLeaderboard, SeasonalPlacement} from './data/interfaces/GlobalLeaderboard';

@Service()
export class LeaderboardService {
  private readonly http = inject(HttpClient);

  baseUrl = environment.apiUrl + '/leaderboard';

  getLeaderboard(date: any = null): Observable<SeasonalLeaderboard>{
    if (date == null) return this.http.get<SeasonalLeaderboard>(`${this.baseUrl}`);

    return this.http.get<SeasonalLeaderboard>(`${this.baseUrl}?date=${date}`);
  }

  getLeaderboardInfo(date: any = null): Observable<SeasonalLeaderboard>{
    if (date == null) return this.http.get<SeasonalLeaderboard>(`${this.baseUrl}/info`);

    return this.http.get<SeasonalLeaderboard>(`${this.baseUrl}/info?date=${date}`);
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
