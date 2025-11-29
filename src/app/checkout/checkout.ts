import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {UserService} from '../user.service';
import {OrderRestAPI} from '../rest_api/order.restapi';
import {Order} from '../models/Order';
import {MatLabel,
        MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserProfile} from '../models/UserProfile';
import {UserRestAPI} from '../rest_api/user.restapi';
import {CartRestAPI} from '../rest_api/cart.restapi';
import {CartItem} from '../models/CartItem';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'checkout',
  templateUrl: 'checkout.html',
  styleUrls: ['checkout.sass'],
  imports: [
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ]
})
export class CheckoutComponent{
  userService = inject(UserService);
  orderRestAPI = inject(OrderRestAPI);
  userRestAPI = inject(UserRestAPI);
  cartRestAPI = inject(CartRestAPI);
  cart: CartItem[] = [];
  fb = inject(FormBuilder);
  userProfile: UserProfile = {
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    houseNumber: '',
    postalCode: '',
    street: '',
    createdAt: '',
    phoneNumber: ''
  };
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

  ngOnInit(){
    this.userService.rxOnBackendId$<CartItem[]>(id => this.cartRestAPI.getCartByUserId(id)).subscribe(
      cart => {
        this.cart = cart;
        cart.forEach(item => this.totalPrice += item.product_price * item.cart_item_count);
      }
    )
    this.userService.rxOnBackendId$<UserProfile>(id => this.userRestAPI.getUserProfile(id)).subscribe(
      profile => {
        this.form.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phoneNumber: profile.phoneNumber,
          country: profile.country,
          city: profile.city,
          postalCode: profile.postalCode,
          street: profile.street,
          houseNumber: profile.houseNumber,
        });
      }
    );
  }

  orderClick(){
    let profile = this.form.value;
    this.userProfile = {
      ...this.userProfile,
      ...profile,
    }
    this.userService.rxOnBackendId$<Order>(id => this.orderRestAPI.order(id, this.userProfile)).subscribe(
      () => this.userService.user.cartItemCount = 0
    )
    this.router.navigate(['/']);
  }
}
