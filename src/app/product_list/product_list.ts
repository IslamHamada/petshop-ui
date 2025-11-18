import {Component, inject} from '@angular/core';
import {ProductRestAPI} from '../rest_api/product.restapi';
import {CartRestAPI} from '../rest_api/cart.restapi';
import {Product} from '../models/Product';
import {AsyncPipe} from '@angular/common';
import {UserService} from '../user.service';

@Component({
  selector: 'products-list',
  templateUrl: 'product_list.html',
  imports: [
    AsyncPipe
  ]
})
export class ProductList {
  productRestService = inject(ProductRestAPI);
  cartRestService = inject(CartRestAPI);
  userService = inject(UserService);

  products$ = this.productRestService.getAllProducts();

  addToCartClick(idx: number){
    this.userService.user.cartItemCount++;
    let product = this.products[idx];
    if(this.userService.user.loggedIn){
      this.userService.rxOnBackendId$(z => this.cartRestService.addCartItem(product.id, 1, z)).subscribe();
    } else {
      let cartItem : CartItem = {
        cart_item_id: -1,
        cart_item_count: 1,
        product_id: product.id,
        product_price: product.price,
        product_name: product.name,
      }
      this.sessionService.addCartItem(cartItem)
    }
  }
}
