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
  orderRestAPI = inject(OrderRestAPI)
  cart$  = this.userService.rxOnBackendId$<CartItem[]>(id => this.cartRestAPI.getCartByUserId(id));
  cart : CartItem[] = [];

  ngOnInit() {
    this.cart$.subscribe(cart => this.cart = cart);
  }

  orderClick(){
    this.userService.rxOnBackendId$<Order>(id => this.orderRestAPI.order(id)).subscribe();
  }

  increaseClick(cart_item_idx : number) {
    let cartItem : CartItem = this.cart[cart_item_idx];
    cartItem.count++;
    this.userService.user.cartItemCount++;
    this.cartRestAPI.updateCartItemCount(cartItem.id, cartItem.count).subscribe()
  }

  decreaseClick(cart_item_idx : number) {
    let cartItem : CartItem = this.cart[cart_item_idx];
    cartItem.count--;
    this.userService.user.cartItemCount--;
    this.cartRestAPI.updateCartItemCount(cartItem.id, cartItem.count).subscribe()
  }

  removeClick(cart_item_idx : number) {
    let cartItem : CartItem = this.cart[cart_item_idx];
    this.userService.user.cartItemCount -= cartItem.count;
    this.cart.splice(cart_item_idx, 1);
    this.cartRestAPI.removeCartItem(cartItem.id).subscribe();
  }
}
