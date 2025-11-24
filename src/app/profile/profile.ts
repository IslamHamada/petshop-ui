import {Component, inject} from '@angular/core';
import {UserService} from '../user.service';
import {OrderRestAPI} from '../rest_api/order.restapi';
import {Order} from '../models/Order';
import {AsyncPipe} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';

@Component({
  selector: 'profile',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatButton
  ],
  templateUrl: 'profile.html'
})
export class ProfileComponent {
  userService = inject(UserService)
  orderRestAPI = inject(OrderRestAPI)
  orderHistory$ = this.userService.rxOnBackendId$<Order[]>(id => this.orderRestAPI.getOrderHistory(id));
}
