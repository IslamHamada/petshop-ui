import {inject, Injectable} from '@angular/core';
import {User} from './models/User';
import {AuthService} from '@auth0/auth0-angular';
import {combineLatest} from 'rxjs';
import {UserRestAPI} from './rest_api/user.restapi';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendIdSubject = new BehaviorSubject<number | null>(null)
  backendId$ = this.backendIdSubject.asObservable();
  loggedIn = false;
  cartItems = 0;
  user : User = {
    auth0_id: '',
    backend_id: -1,
    username: '',
    email: '',
    token: ''
  };
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

  rxOnBackendId$<T>(f: (id: number) => Observable<T>): Observable<T> {
    return this.backendId$.pipe(
      filter(id => id !== null),
      switchMap(id => f(id))
    );
  }
}
