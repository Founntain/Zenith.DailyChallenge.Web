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
import {UserNewComponent} from './views/user-new/user-new.component';
import {RunsComponent} from './views/runs/runs.component';
import {SeasonalComponent} from './views/seasonal/seasonal.component';
import {UserDailiesComponent} from './views/user-dailies/user-dailies.component';
import {CommunityChallengeComponent} from './components/community-challenge/community-challenge.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user/:username', component: UserComponent },
    { path: 'challenge', component: ChallengeComponent },
    { path: 'leaderboard', component: LeaderboardComponent },
    { path: 'cc', component: CommunityChallengeComponent },
    { path: 'cc-archive', component: CommunityArchiveComponent },
    { path: 'daily-archive', component: DailyArchiveComponent },
    { path: 'seasonal', component: SeasonalComponent },
    { path: 'u/:username', component: UserNewComponent },
    { path: 'u/:username/run/:runId', component: RunComponent },
    { path: 'u/:username/runs', component: RunsComponent },
    { path: 'u/:username/dailies', component: UserDailiesComponent },
    { path: 'u/:username/splits', component: SplitsComponent },
];

export const appConfig: ApplicationConfig = {  providers: [provideRouter(routes)]};
