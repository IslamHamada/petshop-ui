import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order} from '../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderRestAPI {
  http = inject(HttpClient);

  order(backend_id : number){
    return this.http.post<Order>(`http://localhost:9090/order/${backend_id}`, {})
  }

  getOrderHistory(backend_id: number){
    return this.http.get<Order[]>(`http://localhost:9090/order/${backend_id}`);
  }
}
