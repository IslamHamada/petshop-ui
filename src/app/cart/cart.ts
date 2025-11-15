import {Component, inject} from '@angular/core'
import {CartRestAPI} from '../rest_api/cart.restapi';
import {AsyncPipe} from '@angular/common';
import {UserService} from '../user.service';
import {CartItem} from '../models/CartItem';

@Component({
  selector: 'cart',
  templateUrl: 'cart.html',
  imports: [
    AsyncPipe
  ]
})
export class Cart {
  cartRestAPI = inject(CartRestAPI);
  userService = inject(UserService);
  cart$  = this.userService.rxOnBackendId$<CartItem[]>(id => this.cartRestAPI.getCartByUserId(id));
}
