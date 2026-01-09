import {Component, inject} from '@angular/core'
import {CartRestAPI} from '../../injectables/rest/cart.restapi';
import {UserService} from '../../user.service';
import {CartItem} from '../../models/CartItem';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {SessionService} from '../../injectables/session/session.service';
import {CartItemComponent} from '../cart_item/cart_item';
import {Router, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'cart',
  templateUrl: 'cart.html',
  styleUrl: 'cart.sass',
  imports: [
    MatCardModule,
    MatButtonModule,
    CartItemComponent,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ]
})
export class Cart {
  cartRestAPI = inject(CartRestAPI);
  userService = inject(UserService);
  sessionService = inject(SessionService);
  router = inject(Router);
  cart$  = this.userService.rxOnBackendId$<CartItem[]>(id => this.cartRestAPI.getCartByUserId(id));
  cart : CartItem[] = [];
  total_price : number = 0;
  loading = false;

  ngOnInit() {
    this.loading = true;
    if(this.userService.user.loggedIn)
      this.cart$.subscribe(cart => {
        this.cart = cart
        this.cart.forEach(item => this.total_price += item.product_price * item.cart_item_count);
        this.loading = false;
      });
    else {
      this.cart = this.sessionService.cart_items;
      this.cart.forEach(item => this.total_price += item.product_price * item.cart_item_count);
      this.loading = false;
    }
  }

  increaseClick(cart_item_idx : number) {
    let cartItem : CartItem = this.cart[cart_item_idx];
    cartItem.cart_item_count++;
    this.userService.user.cartItemCount++;
    if(this.userService.user.loggedIn) {
      console.log(cartItem.cart_item_id)
      console.log(cartItem.cart_item_count)
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
      console.log(cartItem.cart_item_id)
      console.log(cartItem.cart_item_count)
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

  loginToCheckoutClick() {
    this.userService.authObject.loginWithRedirect({
      appState: { withSessionCart: true }
    });
  }
}
