import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {UserService} from '../../user.service';
import {OrderRestAPI} from '../../injectables/rest/order.restapi';
import {Order} from '../../models/Order';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {UserProfile} from '../../models/UserProfile';
import {UserRestAPI} from '../../injectables/rest/user.restapi';
import {CartRestAPI} from '../../injectables/rest/cart.restapi';
import {CartItem} from '../../models/CartItem';
import {MatCardModule} from '@angular/material/card';
import {Router, RouterLink} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SubmittingDirective} from '../../directives/submitting';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'checkout',
  templateUrl: 'checkout.html',
  styleUrls: ['checkout.sass'],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    RouterLink,
    MatProgressSpinnerModule,
    SubmittingDirective,
    MatProgressBarModule,
    MatDividerModule,
  ]
})
export class CheckoutComponent{
  userService = inject(UserService);
  orderRestAPI = inject(OrderRestAPI);
  userRestAPI = inject(UserRestAPI);
  cartRestAPI = inject(CartRestAPI);
  snackBar = inject(MatSnackBar);
  cart: CartItem[] = [];
  totalPrice: number = 0;
  fb = inject(FormBuilder);
  userProfile: UserProfile = new UserProfile();
  form = this.fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
    phoneNumber: [''],
    country: [''],
    city: [''],
    postalCode: [''],
    street: [''],
    houseNumber: ['']
  })

  router = inject(Router);

  init_loading = 2;
  issue_order_loading : boolean = false;

  ngOnInit(){
    this.userService.rxOnBackendId$<CartItem[]>(id => this.cartRestAPI.getCartByUserId(id)).subscribe(
      cart => {
        this.cart = cart;
        cart.forEach(item => this.totalPrice += item.product_price * item.cart_item_count);
        this.init_loading--;
      }
    )
    this.userService.rxOnBackendId$<UserProfile>(id => this.userRestAPI.getUserProfile(id)).subscribe(
      profile => {
        this.form.patchValue({
          ...profile
        });
        this.init_loading--;
      }
    );
  }

  orderClick(){
    this.issue_order_loading = true;
    let profile = this.form.value;
    this.userProfile = {
      ...this.userProfile,
      ...profile,
    }
    this.userService.rxOnBackendId$<Order>(id => this.orderRestAPI.order(id, this.userProfile)).subscribe(
      order => {
        this.issue_order_loading = false;
        this.snackBar.open("A new order has been successfully issued!")._dismissAfter(2000);
        this.userService.user.cartItemCount = 0
        this.router.navigate([`/`])
      }
    )
  }
}
