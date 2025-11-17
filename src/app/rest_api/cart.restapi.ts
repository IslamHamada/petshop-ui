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

  getCartByUserId(user_id : number) {
    return this.http.get<CartItem[]>(`http://localhost:9090/cart/${user_id}`);
  }

  updateCartItemCount(cart_item_id : number, count : number) {
    return this.http.put(`http://localhost:9090/cart/${cart_item_id}`,{count: count});
  }

  removeCartItem(cart_item_id: number) {
    return this.http.delete(`http://localhost:9090/cart/delete/${cart_item_id}`);
  }

  getCartItemCount(user_id: number) {
    return this.http.get<number>(`http://localhost:9090/cart/item_count/${user_id}`);
  }
}
