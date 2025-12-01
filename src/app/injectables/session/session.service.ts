import {inject, Injectable} from '@angular/core';
import {CartItem} from '../../models/CartItem';
import {CartRestAPI} from '../rest/cart.restapi';
import {SessionCart} from '../../models/SessionCart';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  cartRestAPI = inject(CartRestAPI)
  cart_items : CartItem[] = [];

  constructor() {
    if(sessionStorage.getItem('cart_items') === null){
      this.copyCartToSession()
    } else {
      this.copySessionToCart()
    }
  }

  addCartItem(item: CartItem) {
    let idx = this.cart_items.findIndex(x => x.product_id === item.product_id);
    if(idx == -1){
      this.cart_items.push(item);
    } else {
      this.cart_items[idx].cart_item_count++;
    }
    this.copyCartToSession();
  }

  copyCartToSession() {
    sessionStorage.setItem('cart_items', JSON.stringify(this.cart_items));
  }

  copySessionToCart() {
    let session_items = sessionStorage.getItem('cart_items')
    if (session_items !== null) {
      this.cart_items = JSON.parse(session_items);
    }
  }

  getCount() : number {
    return this.cart_items.reduce((acc, x) => acc + x.cart_item_count, 0)
  }

  registerCartInBackendAfterLogin(user_id : number){
    let sessionCart : SessionCart = {
      cart_items: []
    }
    this.cart_items.forEach(cart_item => {
      sessionCart.cart_items.push({
        product_id: cart_item.product_id,
        count: cart_item.cart_item_count
      })
    })
    return this.cartRestAPI.registerSessionCart(user_id, sessionCart);
  }

  emptyCart() {
    this.cart_items = []
    this.copyCartToSession()
  }
}
