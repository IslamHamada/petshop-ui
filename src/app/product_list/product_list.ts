import {Component, inject} from '@angular/core';
import {ProductRestAPI} from '../rest_api/product.restapi';
import {CartRestAPI} from '../rest_api/cart.restapi';
import {UserService} from '../user.service';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {SessionService} from '../session/session.service';
import {Product} from '../models/Product';
import {CartItem} from '../models/CartItem';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'products-list',
  templateUrl: 'product_list.html',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatButton,
    MatPaginator,
    MatCardImage,
    MatCardContent,
    RouterLink
  ]
})
export class ProductList {
  productRestService = inject(ProductRestAPI);
  cartRestService = inject(CartRestAPI);
  userService = inject(UserService);
  sessionService = inject(SessionService);
  products$ = this.productRestService.getAllProducts();
  products : Product[] = [];

  ngOnInit() {
    this.products$.subscribe(products => {
      this.products = products
      this.computeVisibleProducts()
    });
  }

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
        product_image: product.image,
      }
      this.sessionService.addCartItem(cartItem)
    }
  }

  visibleProducts : Product[] = [];
  pageSize = 10;
  pageIndex = 0;

  protected handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.computeVisibleProducts()
  }

  computeVisibleProducts() {
    this.visibleProducts = this.products.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize );
  }
}
