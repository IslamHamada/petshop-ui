import {Component, inject} from '@angular/core';
import {ProductRestAPI} from '../rest_api/product.restapi';

@Component({
  selector: 'products-list',
  templateUrl: 'product_list.html',
})
export class ProductList {
  productRestService = inject(ProductRestAPI);

  products$ = this.productRestService.getAllProducts();
}
