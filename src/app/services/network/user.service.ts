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

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl + '/user/';

  constructor(private http: HttpClient) { }

  getProfile(username: string): Observable<UserProfileData>{
    return this.http.get<UserProfileData>(`${this.baseUrl}${username}/profileData`);
  }

  getDaily(username: string): Observable<DailyData>{
    return this.http.get<any>(`${this.baseUrl}${username}/dailyData`);
  }

  getRuns(username: string, page: number, pageSize: number): Observable<Run[]>{
    return this.http.get<any>(`${this.baseUrl}${username}/runs?page=${page}&pageSize=${pageSize}`);
  }

  getCommunityContributions(username: string, page: number, pageSize: number): Observable<CommunityChallengeContributions[]>{
    return this.http.get<any>(`${this.baseUrl}${username}/getCommunityContributions?page=${page}&pageSize=${pageSize}`);
  }

  getChallenges(username: string, page: number, pageSize: number): Observable<DailyChallenge[]>{
    return this.http.get<any>(`${this.baseUrl}${username}/challenges?page=${page}&pageSize=${pageSize}`);
  }

  getChallengeCompletions(username: string, page: number, pageSize: number): Observable<ChallengeCompletion[]>{
    return this.http.get<any>(`${this.baseUrl}${username}/challengeCompletions?page=${page}&pageSize=${pageSize}`);
  }
}
