import {Component, inject} from '@angular/core';
import {UserService} from '../user.service';
import {OrderRestAPI} from '../rest_api/order.restapi';
import {Order} from '../models/Order';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {UserProfile} from '../models/UserProfile';
import {UserRestAPI} from '../rest_api/user.restapi';
import {FormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'profile',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    FormsModule,
    MatExpansionModule
  ],
  templateUrl: 'profile.html'
})
export class ProfileComponent {
  userService = inject(UserService)
  userRestAPI = inject(UserRestAPI)
  orderRestAPI = inject(OrderRestAPI)
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
  updated = false
  orderHistory : Order[] = [];

  ngOnInit() {
    this.userService.rxOnBackendId$<UserProfile>(id => this.userRestAPI.getUserProfile(id)).subscribe(
      userProfile => this.userProfile = userProfile
    );
    this.userService.rxOnBackendId$<Order[]>(id => this.orderRestAPI.getOrderHistory(id)).subscribe(
      orderHistory => this.orderHistory = orderHistory
    );
  }

  saveProfileClick(){
    this.updated = false;
    this.userService.rxOnBackendId$(id => this.userRestAPI.saveUserProfile(id, this.userProfile))
      .subscribe(()=> this.updated = true);
  }
}
