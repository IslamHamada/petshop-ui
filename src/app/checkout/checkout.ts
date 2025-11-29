import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {UserService} from '../user.service';
import {OrderRestAPI} from '../rest_api/order.restapi';
import {Order} from '../models/Order';
import {MatLabel,
        MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {UserProfile} from '../models/UserProfile';
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
    RouterLink
  ]
})
export class CheckoutComponent{
  userService = inject(UserService);
  orderRestAPI = inject(OrderRestAPI);
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
  router = inject(Router);

  ngOnInit(){
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
    this.userService.rxOnBackendId$<Order>(id => this.orderRestAPI.order(id)).subscribe();
    this.userService.user.cartItemCount = 0;
    this.userService.rxOnBackendId$<Order>(id => this.orderRestAPI.order(id, this.userProfile)).subscribe(
      () => this.userService.user.cartItemCount = 0
    )
    this.router.navigate(['/']);
  }
}
