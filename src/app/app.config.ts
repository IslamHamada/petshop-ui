import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAuth0, authHttpInterceptorFn} from '@auth0/auth0-angular';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {environment} from 'environment/environment'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideRouter(routes),
    provideAuth0({
      domain: 'dev-atfpp36qj24tzo8l.us.auth0.com',
      clientId: 'UxGoFyQJ1IPiuc2RkPtb4v84jpe3x2jg',
      authorizationParams: {
        redirect_uri: 'http://localhost:8090',
        audience: 'http://random/api'
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      httpInterceptor: {
        allowedList: [
          `${environment.gatewayUrl}/cart`,
          `${environment.gatewayUrl}/cart/*`,

          `${environment.gatewayUrl}/order`,
          `${environment.gatewayUrl}/order/*`,

          `${environment.gatewayUrl}/user`,
          `${environment.gatewayUrl}/user/*`,
          ]
      },
    }),
  ]
};
