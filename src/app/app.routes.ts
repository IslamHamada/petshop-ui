import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Cart} from './cart/cart';
import {Profile} from './profile/profile';
import {ProductComponent} from './product/product.component';
import {CheckoutComponent} from './checkout/checkout';

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
    path: 'checkout',
    component: CheckoutComponent,
    title: 'Checkout',
  },
  {
    path: 'product/:id',
    component: ProductComponent,
    title: 'Product',
  },
  {
    path: 'profile',
    component: Profile,
    title: 'Profile',
  }
];
