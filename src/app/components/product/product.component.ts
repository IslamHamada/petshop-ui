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
import {MatIconModule} from "@angular/material/icon";
import {forkJoin, Observable, switchMap} from "rxjs";
import {UserRestAPI} from "../../injectables/rest/user.restapi";
import {ReviewSummary} from "../../models/ReviewSummary";

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
    MatIconModule,
  ],
  styleUrls: ['./product.component.sass']
})
export class ProductComponent {
  product : Product | undefined;
  productRestAPI = inject(ProductRestAPI);
  cartRestAPI = inject(CartRestAPI);
  reviewRestAPI = inject(ReviewRestAPI);
  userRestAPI = inject(UserRestAPI);
  userService = inject(UserService);
  sessionService = inject(SessionService);
  route = inject(ActivatedRoute)
  snackBar = inject(MatSnackBar);
  id = Number(this.route.snapshot.paramMap.get('id'));
  loading : number = 1;
  reviewSummary : ReviewSummary = {
    rating: 0,
    count: 0
  };

  ngOnInit() {
    this.productRestAPI.getProductById(this.id).subscribe(
      product => {
        this.product = product;
        this.loading--;
      }
    );

    this.reviewRestAPI.getReviewsByProductId(this.id).pipe(
        switchMap(reviews => {
          this.reviews = reviews;
          this.reviewsUnfoldClick();
          let restCalls : Observable<string>[] = [];
          for(let i = 0; i < reviews.length; i++){
            restCalls.push(this.userRestAPI.getUsername(reviews[i].userId));
          }
          return forkJoin(restCalls);
        })
      ).subscribe(usernames => {
        for(let i = 0; i < usernames.length; i++){
          this.reviews[i].username = usernames[i];
          this.reviewSummary.rating += this.reviews[i].rating;
        }
        this.reviewSummary.count = this.reviews.length;
        this.reviewSummary.rating = this.reviewSummary.rating / this.reviewSummary.count;
        this.loading--;
    });
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
  shownReviewsCount = 0;
  reviewsPerFold = 5;
  unfoldEnabled : boolean = false;

  reviewsUnfoldClick() {
    let hiddenCount = this.reviews.length - this.shownReviewsCount;
    if(hiddenCount <= this.reviewsPerFold) {
      this.shownReviewsCount += this.reviewsPerFold;
      this.unfoldEnabled = false;
    } else {
      this.unfoldEnabled = true;
    }
    this.shownReviewsCount += this.reviewsPerFold;
  }
}
