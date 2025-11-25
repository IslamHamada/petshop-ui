import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order} from '../models/Order';
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class OrderRestAPI {
  http = inject(HttpClient);

  order(backend_id : number){
    return this.http.post<Order>(`${environment.gateway_url}/order/${backend_id}`, {})
  }

  getOrderHistory(backend_id: number){
    return this.http.get<Order[]>(`${environment.gateway_url}/order/${backend_id}`);
  }
}
