import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/User';
import {environment} from '../../environments/environment'
import {UserProfile} from '../models/UserProfile';

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

  getUserProfile(user_id : number) {
    return this.http.get<UserProfile>(`${environment.gateway_url}/user/${user_id}`);
  }

  saveUserProfile(user_id : number, user_profile: UserProfile) {
    return this.http.put<UserProfile>(`${environment.gateway_url}/user/${user_id}`, user_profile)
  }
}
