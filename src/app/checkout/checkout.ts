import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {UserService} from '../user.service';
import {OrderRestAPI} from '../rest_api/order.restapi';
import {Order} from '../models/Order';
import {MatLabel,
        MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'checkout',
  templateUrl: 'checkout.html',
  styleUrls: ['checkout.sass'],
  imports: [
    MatButton,
    MatFormField,
    MatLabel,
    MatInput
  ]
})
export class CheckoutComponent{
  userService = inject(UserService);
  orderRestAPI = inject(OrderRestAPI);

  orderClick(){
    this.userService.rxOnBackendId$<Order>(id => this.orderRestAPI.order(id)).subscribe();
    this.userService.user.cartItemCount = 0;
  }
}
