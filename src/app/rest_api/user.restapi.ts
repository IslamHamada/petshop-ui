import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserRestAPI {
  http = inject(HttpClient);
  addUserAndGetNumId(user: User) {
    this.http.post<number>('http://localhost:9090/user', {
      id: user.id,
      username: user.username,
      email: user.email,
    }).subscribe(id => {
      user.num_id = id;
    });
  }
}
