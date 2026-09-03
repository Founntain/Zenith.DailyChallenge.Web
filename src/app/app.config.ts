import {ApplicationConfig, EnvironmentInjector, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withNoIncrementalHydration } from '@angular/platform-browser';
import {provideHttpClient, withXhr} from '@angular/common/http';

import {provideCharts, withDefaultRegisterables,} from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    provideHttpClient(withXhr()),
    provideCharts(withDefaultRegisterables())
  ]
};
