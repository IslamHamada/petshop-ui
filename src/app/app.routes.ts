import { Routes } from '@angular/router';
import {Cart} from './components/cart/cart';
import {ProfileComponent} from './components/profile/profile';
import {ProductList} from './components/product_list/product_list';
import {ProductComponent} from './components/product/product.component';
import {CheckoutComponent} from './components/checkout/checkout';
import {ErrorComponent} from './components/error/error.component';

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
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: 'Error',
  }
];
