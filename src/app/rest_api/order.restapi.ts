import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order} from '../models/Order';
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class OrderRestAPI {
  http = inject(HttpClient);

  order(backend_id : number){
    return this.http.post<Order>(`${environment.gatewayUrl}/order/${backend_id}`, {})
  }

  getOrderHistory(backend_id: number){
    return this.http.get<Order[]>(`${environment.gatewayUrl}/order/${backend_id}`);
  }
}
