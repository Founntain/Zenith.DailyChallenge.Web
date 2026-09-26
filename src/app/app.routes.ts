import {provideRouter, Routes} from '@angular/router';
import {UserComponent} from './views/user/user.component';
import {ApplicationConfig} from '@angular/core';
import {CreateComponent} from './views/create/create.component';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent) },
    { path: 'leaderboard', loadComponent: () => import('./views/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent) },
    { path: 'cc', loadComponent: () => import('./components/community-challenge/community-challenge.component').then(m => m.CommunityChallengeComponent) },
    { path: 'cc-archive', loadComponent: () => import('./views/community-archive/community-archive.component').then(m => m.CommunityArchiveComponent) },
    { path: 'daily-archive', loadComponent: () => import('./views/daily-archive/daily-archive.component').then(m => m.DailyArchiveComponent) },
    { path: 'seasonal', loadComponent: () => import('./views/seasonal/seasonal.component').then(m => m.SeasonalComponent) },

    // User routes
    { path: 'u/:username', loadComponent: () => import('./views/user/user.component').then(m => m.UserComponent) },
    { path: 'u/:username/run/:runId', loadComponent: () => import('./views/run/run.component').then(m => m.RunComponent) },
    { path: 'u/:username/runs', loadComponent: () => import('./views/runs/runs.component').then(m => m.RunsComponent) },
    { path: 'u/:username/dailies', loadComponent: () => import('./views/user-dailies/user-dailies.component').then(m => m.UserDailiesComponent) },
    { path: 'u/:username/splits', loadComponent: () => import('./views/splits/splits.component').then(m => m.SplitsComponent) },

    //WIP
    { path: 'create', component: CreateComponent },

    // Legacy
    { path: 'user/:username', component: UserComponent },
];

export const appConfig: ApplicationConfig = {  providers: [provideRouter(routes)]};
