import {provideRouter, Routes} from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {UserComponent} from './views/user/user.component';
import {ApplicationConfig} from '@angular/core';
import {ChallengeComponent} from './components/challenge/challenge.component';
import {SplitsComponent} from './views/splits/splits.component';
import {LeaderboardComponent} from './views/leaderboard/leaderboard.component';
import {CommunityArchiveComponent} from './views/community-archive/community-archive.component';
import {DailyArchiveComponent} from './views/daily-archive/daily-archive.component';
import {RunComponent} from './components/run/run.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user/:username', component: UserComponent },
    { path: 'user/:username/splits', component: SplitsComponent },
    { path: 'challenge', component: ChallengeComponent },
    { path: 'leaderboard', component: LeaderboardComponent },
    { path: 'cc-archive', component: CommunityArchiveComponent },
    { path: 'daily-archive', component: DailyArchiveComponent },
    { path: 'user/:username/run/:runId', component: RunComponent }
];

export const appConfig: ApplicationConfig = {  providers: [provideRouter(routes)]};
