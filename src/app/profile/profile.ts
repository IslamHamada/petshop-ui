import {Component, inject} from '@angular/core';
import {UserService} from '../user.service';
import {OrderRestAPI} from '../rest_api/order.restapi';
import {Order} from '../models/Order';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'profile',
  imports: [
    AsyncPipe
  ],
  templateUrl: 'profile.html'
})
export class Profile{
  userService = inject(UserService)
  orderRestAPI = inject(OrderRestAPI)
  orderHistory$ = this.userService.rxOnBackendId$<Order[]>(id => this.orderRestAPI.getOrderHistory(id));
}
