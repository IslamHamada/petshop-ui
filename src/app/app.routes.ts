import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Cart} from './cart/cart';
import {Profile} from './profile/profile';

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
  {
    path: 'profile',
    component: Profile,
    title: 'Profile',
  }
];
