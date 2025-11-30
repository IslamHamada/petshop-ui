import {Component, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {CartItem} from '../models/CartItem';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'cart-item',
  templateUrl: 'cart_item.html',
  imports: [
    MatCardModule,
    RouterLink,
  ],
  styleUrl: 'cart_item.sass'
})
export class CartItemComponent {
  cart_item = input.required<CartItem>()
}
