import { Routes } from '@angular/router';
import {Cart} from './cart/cart';
import {ProfileComponent} from './profile/profile';
import {ProductList} from './product_list/product_list';
import {ProductComponent} from './product/product.component';
import {CheckoutComponent} from './checkout/checkout';

export const routes: Routes = [
  {
    path: '',
    component: ProductList,
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
    component: ProfileComponent,
    title: 'Profile',
  }
];
