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
import {UserRestAPI} from './injectables/rest/user.restapi';
import {CartRestAPI} from './injectables/rest/cart.restapi';
import {SessionService} from './injectables/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendIdSubject = new BehaviorSubject<number | null>(null)
  backendId$ = this.backendIdSubject.asObservable();
  user : User = new User();
  userRestAPI = inject(UserRestAPI)
  cartRestAPI = inject(CartRestAPI)
  sessionService = inject(SessionService);

  constructor(public authObject: AuthService) {
    authObject.isAuthenticated$.pipe(
      distinctUntilChanged(),
      tap(auth => {
        this.user.loggedIn = auth
        if(!auth){
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

    this.rxOnBackendId$(id => this.cartRestAPI.getCartItemCount(id))
      .subscribe(item_count => this.user.cartItemCount = item_count);

    this.authObject.isAuthenticated$.pipe(
      filter(auth => auth),
      switchMap(() => this.authObject.appState$),
      filter(state => state['withSessionCart']),
      switchMap(() => this.rxOnBackendId$(id => this.sessionService.registerCartInBackendAfterLogin(id))),
    ).subscribe(() => {
      this.user.cartItemCount = this.sessionService.getCount();
      this.sessionService.emptyCart();
    })
  }

  rxOnBackendId$<T>(f: (id: number) => Observable<T>): Observable<T> {
    return this.backendId$.pipe(
      filter(id => id !== null),
      switchMap(id => f(id))
    );
  }
}
