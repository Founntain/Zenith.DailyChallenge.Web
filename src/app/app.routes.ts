import {provideRouter, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {UserComponent} from './components/user/user.component';
import {ApplicationConfig} from '@angular/core';
import {ChallengeComponent} from './components/challenge/challenge.component';
import {SplitsComponent} from './components/splits/splits.component';
import {LeaderboardComponent} from './components/leaderboard/leaderboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user/:username', component: UserComponent },
    { path: 'user/:username/splits', component: SplitsComponent },
    { path: 'challenge', component: ChallengeComponent },
    { path: 'leaderboard', component: LeaderboardComponent }
];

export const appConfig: ApplicationConfig = {  providers: [provideRouter(routes)]};
