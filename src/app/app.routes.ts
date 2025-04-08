import {provideRouter, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {UserComponent} from './components/user/user.component';
import {ApplicationConfig} from '@angular/core';
import {ChallengeComponent} from './components/challenge/challenge.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user/:username', component: UserComponent },
    { path: 'challenge', component: ChallengeComponent }
];



export const appConfig: ApplicationConfig = {  providers: [provideRouter(routes)]};
