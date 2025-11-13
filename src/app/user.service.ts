import {inject, Injectable} from '@angular/core';
import {User} from './models/User';
import {AuthService} from '@auth0/auth0-angular';
import {combineLatest} from 'rxjs';
import {UserRestAPI} from './rest_api/user.restapi';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedIn = false;
  cartItems = 0;
  user : User | undefined;
  userRestAPI = inject(UserRestAPI)

  constructor(public auth: AuthService) {
    auth.isAuthenticated$.subscribe(auth => {
      this.loggedIn = auth;
      if(auth) {
        combineLatest([
          this.auth.user$,
          this.auth.getAccessTokenSilently()
        ]).subscribe(([user, token]) => {
          console.log('Token:', token);
          this.user = {
            auth0_id: user?.sub ?? '',
            username: user?.['username'] ?? user?.name ?? '',
            email: user?.email ?? '',
            token: token ?? '',
            backend_id: 0
          };
          this.userRestAPI.addUserAndGetNumId(this.user)
        });
      }
    })
  }
}
