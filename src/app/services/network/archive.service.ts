import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommunityChallengeArchive} from './data/interfaces/CommunityChallengeArchive';
import {DailyChallengeArchive} from './data/interfaces/DailyChallengeArchive';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  baseUrl = environment.apiUrl + '/archive/';

  constructor(private http: HttpClient) { }

  getPastDailyChallenges(date: any = null): Observable<DailyChallengeArchive[]>{
    if (date == null) return this.http.get<DailyChallengeArchive[]>(`${this.baseUrl}daily`);

    return this.http.get<DailyChallengeArchive[]>(`${this.baseUrl}daily?date=${date}`);
  }

  getPastCommunityChallenges(id: any = null): Observable<CommunityChallengeArchive>{
    if (id == null) return this.http.get<CommunityChallengeArchive>(`${this.baseUrl}community`);

    return this.http.get<CommunityChallengeArchive>(`${this.baseUrl}community?id=${id}`);
  }
}
