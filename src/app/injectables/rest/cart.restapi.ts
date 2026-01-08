import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CartItem} from '../../models/CartItem';
import {SessionCart} from '../../models/SessionCart';
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CartRestAPI {
  http = inject(HttpClient);

  addCartItem(product_id: number, count: number, backend_id: number) {
    return this.http.post(`${environment.gateway_url}/cart`,{
      backend_id: backend_id,
      product_id: product_id,
      count: count
    });
  }

  getCartByUserId(user_id : number) {
    return this.http.get<CartItem[]>(`${environment.gateway_url}/cart/user/${user_id}`);
  }

  updateCartItemCount(cart_item_id : number, count : number) {
    return this.http.put(`${environment.gateway_url}/cart/user/item_count/${cart_item_id}`,{count: count});
  }

  removeCartItem(cart_item_id: number) {
    return this.http.delete(`${environment.gateway_url}/cart/cart_item/${cart_item_id}`);
  }

  getCartItemCount(user_id: number) {
    return this.http.get<number>(`${environment.gateway_url}/cart/user/item_count/${user_id}`);
  }

  registerSessionCart(user_id: number,  cart : SessionCart) {
    return this.http.post(`${environment.gateway_url}/cart/login_to_checkout/${user_id}`, cart);
  }
}
