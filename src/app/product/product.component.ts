import {Component, inject, input} from '@angular/core';
import {ProductRestAPI} from '../rest_api/product.restapi';
import {ActivatedRoute} from '@angular/router';
import {Product} from '../models/Product';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardXlImage
} from '@angular/material/card';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'product-component',
  templateUrl: './product.component.html',
  imports: [
    MatCard,
    MatButton,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardXlImage
  ],
  styleUrls: ['./product_component.sass']
})
export class ProductComponent {
  product : Product | undefined;
  productRestAPI = inject(ProductRestAPI);
  route = inject(ActivatedRoute)
  id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit() {
    this.productRestAPI.getProductById(this.id).subscribe(
      product => {
        console.log(product)
        this.product = product
      }
    )
  }

  protected addToCartClick(param: {}) {

  }
}
