import {Component, input} from '@angular/core';
import {
  MatCardContent,
  MatCardHeader,
  MatCardLgImage,
} from '@angular/material/card';
import {CartItem} from '../models/CartItem';

@Component({
  selector: 'cart-item',
  templateUrl: 'cart_item.html',
  imports: [
    MatCardContent,
    MatCardHeader,
    MatCardLgImage,
  ],
  styleUrl: 'cart_item.sass'
})
export class CartItemComponent {
  cart_item = input.required<CartItem>()
}
