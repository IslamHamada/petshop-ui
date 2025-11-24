import {Component, inject} from '@angular/core'
import {CartRestAPI} from '../rest_api/cart.restapi';
import {UserService} from '../user.service';
import {CartItem} from '../models/CartItem';
import {OrderRestAPI} from '../rest_api/order.restapi';
import {Order} from '../models/Order';

@Component({
  selector: 'cart',
  templateUrl: 'cart.html',
})
export class Cart {
  cartRestAPI = inject(CartRestAPI);
  userService = inject(UserService);
  sessionService = inject(SessionService);
  cart$  = this.userService.rxOnBackendId$<CartItem[]>(id => this.cartRestAPI.getCartByUserId(id));
  cart : CartItem[] = [];
  total_price : number = 0;

  ngOnInit() {
    if(this.userService.user.loggedIn)
      this.cart$.subscribe(cart => {
        this.cart = cart
        this.cart.forEach(item => this.total_price += item.product_price * item.cart_item_count);
      });
    else {
      this.cart = this.sessionService.cart_items;
      this.cart.forEach(item => this.total_price += item.product_price * item.cart_item_count);
    }
  }

  increaseClick(cart_item_idx : number) {
    let cartItem : CartItem = this.cart[cart_item_idx];
    cartItem.cart_item_count++;
    this.userService.user.cartItemCount++;
    if(this.userService.user.loggedIn) {
      this.cartRestAPI.updateCartItemCount(cartItem.cart_item_id, cartItem.cart_item_count).subscribe()
    } else {
      this.sessionService.copyCartToSession();
    }
    this.total_price += cartItem.product_price;
  }

  decreaseClick(cart_item_idx : number) {
    let cartItem : CartItem = this.cart[cart_item_idx];
    cartItem.cart_item_count--;
    this.userService.user.cartItemCount--;
    if(this.userService.user.loggedIn) {
      this.cartRestAPI.updateCartItemCount(cartItem.cart_item_id, cartItem.cart_item_count).subscribe()
    } else {
      this.sessionService.copyCartToSession();
    }
    this.total_price -= cartItem.product_price;
  }

  removeClick(cart_item_idx : number) {
    let cartItem : CartItem = this.cart[cart_item_idx];
    this.userService.user.cartItemCount -= cartItem.cart_item_count;
    this.cart.splice(cart_item_idx, 1);
    if(this.userService.user.loggedIn) {
      this.cartRestAPI.removeCartItem(cartItem.cart_item_id).subscribe();
    } else {
      this.sessionService.copyCartToSession();
    }
    this.total_price -= cartItem.product_price * cartItem.cart_item_count;
  }
  }
}
