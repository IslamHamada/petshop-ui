import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Cart} from './cart/cart';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page',
  },
  {
    path: 'cart',
    component: Cart,
    title: 'Cart',
  },
];
