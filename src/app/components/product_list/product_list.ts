import {Component, inject} from '@angular/core';
import {ProductRestAPI} from '../../injectables/rest/product.restapi';
import {CartRestAPI} from '../../injectables/rest/cart.restapi';
import {UserService} from '../../user.service';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {SessionService} from '../../injectables/session/session.service';
import {Product} from '../../models/Product';
import {CartItem} from '../../models/CartItem';
import {RouterLink} from '@angular/router';
import {MatChipListboxChange, MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'products-list',
  templateUrl: 'product_list.html',
  styleUrls: ['product_list.sass'],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    RouterLink,
    MatChipsModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ]
})
export class ProductList {
  init_loading = 3;
  productRestService = inject(ProductRestAPI);
  cartRestService = inject(CartRestAPI);
  userService = inject(UserService);
  sessionService = inject(SessionService);
  products$ = this.productRestService.getAllProducts();
  products : Product[] = [];

  ngOnInit() {
    this.productRestService.getUtilities().subscribe(
      utilities => {
          this.utility_list = utilities;
          this.init_loading--;
        }
    )
    this.productRestService.getForAnimals().subscribe(
      for_animals => {
        this.for_animal_list = for_animals;
        this.init_loading--;
      }
    )
    this.products$.subscribe(products => {
      this.products = products;
      this.computeFilteredProducts();
      this.computeVisibleProducts();
      this.init_loading--;
    });
  }

  addToCartClick(idx: number){
    this.userService.user.cartItemCount++;
    let product = this.products[idx];
    if(this.userService.user.loggedIn){
      this.userService.rxOnBackendId$(z => this.cartRestService.addCartItem(product.id, 1, z)).subscribe();
    } else {
      let cartItem : CartItem = {
        cart_item_id: -1,
        cart_item_count: 1,
        product_id: product.id,
        product_price: product.price,
        product_name: product.name,
        product_image: product.image,
      }
      this.sessionService.addCartItem(cartItem)
    }
  }

  filtered_products : Product[] = [];
  visibleProducts : Product[] = [];
  pageSize = 10;
  pageIndex = 0;
  utility : string = "none"
  for_animal: string = "none"

  protected handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.computeVisibleProducts();
  }

  computeFilteredProducts() {
    this.filtered_products = this.products.filter(
      product => this.utility === "none" || product.utility === this.utility
    ).filter(
      product => this.for_animal === "none" || product.for_animal === this.for_animal
    ).filter(
      product => {
        let cleanedTerm = this.searchTerm.toLowerCase().trim();
        return product.name.toLowerCase().includes(cleanedTerm) ||
        product.description.toLowerCase().includes(cleanedTerm)
      }
    );
  }

  computeVisibleProducts() {
    this.visibleProducts = this.filtered_products.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize );
  }

  utility_list: string[] = []
  for_animal_list: string[] = []

  protected onSelectUtility(event: MatChipListboxChange) {
    if(event.value == null)
      this.utility = "none"
    else
        this.utility = event.value;
    this.pageIndex = 0;
    this.computeFilteredProducts();
    this.computeVisibleProducts();
  }

  protected onSelectForAnimal(event: MatChipListboxChange) {
    if(event.value == null)
      this.for_animal = "none"
    else
      this.for_animal = event.value;
    this.pageIndex = 0;
    this.computeFilteredProducts();
    this.computeVisibleProducts();
  }

  searchTerm: string = "";

  protected search() {
    this.pageIndex = 0;
    this.computeFilteredProducts();
    this.computeVisibleProducts();
  }
}
