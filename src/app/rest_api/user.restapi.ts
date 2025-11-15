import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserRestAPI {
  http = inject(HttpClient);

  addUserToBackendAndGetId(user: User) {
    return this.http.post<number>('http://localhost:9090/user', {
      auth0_id: user.auth0_id,
      username: user.username,
      email: user.email,
    });
  }
}
