import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import {provideAuth0, authHttpInterceptorFn} from '@auth0/auth0-angular';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {environment} from '../environments/environment'
import {RestErrorInterceptor} from './ErrorHandlers/RestErrorInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([
      authHttpInterceptorFn,
      RestErrorInterceptor
    ])),
    provideRouter(
      routes,
      withComponentInputBinding()),
    provideAuth0({
      domain: 'dev-atfpp36qj24tzo8l.us.auth0.com',
      clientId: 'UxGoFyQJ1IPiuc2RkPtb4v84jpe3x2jg',
      authorizationParams: {
        redirect_uri: `${environment.frontend_url}`,
        audience: 'http://random/api'
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      httpInterceptor: {
        allowedList: [
          `${environment.gateway_url}/cart`,
          `${environment.gateway_url}/cart/*`,

          `${environment.gateway_url}/order`,
          `${environment.gateway_url}/order/*`,

          `${environment.gateway_url}/user`,
          `${environment.gateway_url}/user/*`,
          ]
      },
    }),
  ]
};
