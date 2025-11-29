import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order} from '../models/Order';
import {environment} from '../../environments/environment'
import {UserProfile} from '../models/UserProfile';

@Injectable({
  providedIn: 'root'
})
export class OrderRestAPI {
  http = inject(HttpClient);

  order(backend_id : number, profile : UserProfile){
    return this.http.post<Order>(`${environment.gateway_url}/order/${backend_id}`, profile)
  }

  getOrderHistory(backend_id: number){
    return this.http.get<Order[]>(`${environment.gateway_url}/order/${backend_id}`);
  }
}
