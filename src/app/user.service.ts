import {inject, Injectable} from '@angular/core';
import {User} from './models/User';
import {AuthService} from '@auth0/auth0-angular';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  Observable,
  switchMap,
  tap
} from 'rxjs';
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

  constructor(public authObject: AuthService) {
    authObject.isAuthenticated$.pipe(
      distinctUntilChanged(),
      tap(auth => {
        this.loggedIn = auth
        if(!auth){
          this.cartItems = 0;
          this.backendIdSubject.next(null);
        }
      }),
      filter(auth => auth),
      switchMap(() =>
        combineLatest([
          authObject.user$,
          authObject.getAccessTokenSilently()
        ])
      ),
      switchMap(([user, token]) => {
        this.user.auth0_id = user?.sub ?? '';
        this.user.username = user?.['username'] ?? user?.name ?? '';
        this.user.email = user?.email ?? '';
        this.user.token = token ?? '';
        return this.userRestAPI.addUserToBackendAndGetId(this.user);
      })
    ).subscribe(backendId => {
      this.backendIdSubject.next(backendId);
      this.user.backend_id = backendId;
    });
  }

  rxOnBackendId$<T>(f: (id: number) => Observable<T>): Observable<T> {
    return this.backendId$.pipe(
      filter(id => id !== null),
      switchMap(id => f(id))
    );
  }
}
