import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CartItem} from '../models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartRestAPI {
  http = inject(HttpClient);

  addCartItem(product_id: number, count: number, backend_id: number) {
    return this.http.post("http://localhost:9090/cart",{
      backend_id: backend_id,
      product_id: product_id,
      count: count
    });
  }

  getCartByUserId(id : number) {
    return this.http.get<CartItem[]>(`http://localhost:9090/cart/${id}`);
  }
}
