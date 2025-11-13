import {Component, inject} from '@angular/core';
import {ProductRestAPI} from '../rest_api/product.restapi';
import {Product} from '../models/Product';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'products-list',
  templateUrl: 'product_list.html',
  imports: [
    AsyncPipe
  ]
})
export class ProductList {
  productRestService = inject(ProductRestAPI);

  products$ = this.productRestService.getAllProducts();
}
