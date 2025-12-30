import {Component, inject} from '@angular/core';
import {ProductRestAPI} from '../../injectables/rest/product.restapi';
import {ActivatedRoute} from '@angular/router';
import {Product} from '../../models/Product';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {CartRestAPI} from '../../injectables/rest/cart.restapi';
import {UserService} from '../../user.service';
import {CartItem} from '../../models/CartItem';
import {SessionService} from '../../injectables/session/session.service';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Review} from "../../models/Review";
import {ReviewRestAPI} from "../../injectables/rest/review-restapi.service";
import {ReviewComponent} from "../review/review.component";
import {MatIcon} from "@angular/material/icon";
import {forkJoin, Observable, switchMap} from "rxjs";

@Component({
  selector: 'product-component',
  templateUrl: './product.component.html',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    ReviewComponent,
    MatIcon,
  ],
  styleUrls: ['./product_component.sass']
})
export class ProductComponent {
  product : Product | undefined;
  productRestAPI = inject(ProductRestAPI);
  cartRestAPI = inject(CartRestAPI);
  reviewRestAPI = inject(ReviewRestAPI);
  userService = inject(UserService);
  sessionService = inject(SessionService);
  route = inject(ActivatedRoute)
  snackBar = inject(MatSnackBar);
  id = Number(this.route.snapshot.paramMap.get('id'));
  loading : boolean = true;

  ngOnInit() {
    this.productRestAPI.getProductById(this.id).subscribe(
      product => {
        this.product = product
        this.loading = false;
      }
    )

    this.reviewRestAPI.getReviewsByProductId(this.id).pipe(
        switchMap(reviews => {
          this.reviews = reviews;
          let restCalls : Observable<UserProfile>[] = [];
          for(let i = 0; i < reviews.length; i++){
            restCalls.push(this.userRestAPI.getUserProfile(reviews[i].userId));
          }
          return forkJoin(restCalls);
        })
      ).subscribe(profiles => {
        for(let i = 0; i < profiles.length; i++){
          this.reviews[i].username = profiles[i].username;
        }
  }

  protected addToCartClick() {
    if(this.product) {
      this.userService.user.cartItemCount++;
      if (this.userService.user.loggedIn) {
        this.userService.rxOnBackendId$(z => {
          this.snackBar.open(this.product?.name + " is added to the cart")._dismissAfter(2000);
          return this.cartRestAPI.addCartItem(this.product?.id ?? -1, 1, z);
        }).subscribe();
      } else {
        let cartItem: CartItem = {
          cart_item_id: -1,
          cart_item_count: 1,
          product_id: this.product.id,
          product_price: this.product.price,
          product_name: this.product.name,
          product_image: this.product.image,
        }
        this.sessionService.addCartItem(cartItem);
        this.snackBar.open(this.product.name + " is added to the cart")._dismissAfter(2000);
      }
    }
  }

  reviews : Review[] = [];
}
