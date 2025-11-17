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

  addToCartClick(product_id: number){
    this.userService.user.cartItemCount++;
    if(this.userService.user.loggedIn){
      this.userService.rxOnBackendId$(z => this.cartRestService.addCartItem(product_id, 1, z)).subscribe();
    } else {

    }
  }
}
