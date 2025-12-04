import {Component, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {CartItem} from '../../models/CartItem';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'cart-item',
  templateUrl: 'cart_item.html',
  imports: [
    MatCardModule,
    RouterLink,
    MatIconModule,
  ],
  styleUrl: 'cart_item.sass'
})
export class CartItemComponent {
  cart_item = input.required<CartItem>()
}
