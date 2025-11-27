import {Component, inject, input} from '@angular/core';
import {ProductRestAPI} from '../rest_api/product.restapi';
import {ActivatedRoute} from '@angular/router';
import {Product} from '../models/Product';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardXlImage
} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {CartRestAPI} from '../rest_api/cart.restapi';
import {UserService} from '../user.service';
import {CartItem} from '../models/CartItem';
import {SessionService} from '../session/session.service';

@Component({
  selector: 'product-component',
  templateUrl: './product.component.html',
  imports: [
    MatCard,
    MatButton,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardXlImage
  ],
  styleUrls: ['./product_component.sass']
})
export class ProductComponent {
  product : Product | undefined;
  productRestAPI = inject(ProductRestAPI);
  cartRestAPI = inject(CartRestAPI);
  userService = inject(UserService);
  sessionService = inject(SessionService);
  route = inject(ActivatedRoute)
  id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit() {
    this.productRestAPI.getProductById(this.id).subscribe(
      product => {
        console.log(product)
        this.product = product
      }
    )
  }

  protected addToCartClick() {
    if(this.product) {
      this.userService.user.cartItemCount++;
      if (this.userService.user.loggedIn) {
        this.userService.rxOnBackendId$(z => this.cartRestAPI.addCartItem(this.product?.id ?? -1, 1, z)).subscribe();
      } else {
        let cartItem: CartItem = {
          cart_item_id: -1,
          cart_item_count: 1,
          product_id: this.product.id,
          product_price: this.product.price,
          product_name: this.product.name,
          product_image: this.product.image,
        }
        this.sessionService.addCartItem(cartItem)
      }
    }
  }
}
