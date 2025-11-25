import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/User';
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserRestAPI {
  http = inject(HttpClient);

  addUserToBackendAndGetId(user: User) {
    return this.http.post<number>(`${environment.gateway_url}/user`, {
      auth0_id: user.auth0_id,
      username: user.username,
      email: user.email,
    });
  }
}
