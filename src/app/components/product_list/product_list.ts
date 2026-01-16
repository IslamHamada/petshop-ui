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
import {MatSnackBar} from '@angular/material/snack-bar';
import {forkJoin, Observable, switchMap, tap} from "rxjs";
import {ReviewSummary} from "../../models/ReviewSummary";
import {ReviewRestAPI} from "../../injectables/rest/review-restapi.service";
import {MatSelectModule} from "@angular/material/select";

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
    MatSelectModule,
  ]
})
export class ProductList {
  init_loading = 4;
  productRestService = inject(ProductRestAPI);
  cartRestService = inject(CartRestAPI);
  reviewRestService = inject(ReviewRestAPI);
  userService = inject(UserService);
  sessionService = inject(SessionService);
  snackBar = inject(MatSnackBar);
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
    this.products$.pipe(
      tap(products => {
          this.products = products;
          this.computeFilteredProducts();
          this.computeVisibleProducts();
          this.init_loading--;
        }),
      switchMap(products => {
        let summaryRestRequests : Observable<ReviewSummary>[] = [];
        for(let i = 0; i < products.length; i++){
          summaryRestRequests[i] = this.reviewRestService.getReviewsSummaryByProductId(products[i].id);
        }
        return forkJoin(summaryRestRequests);
      })
    ).subscribe(summaries => {
      for(let i = 0; i < summaries.length; i++){
        this.products[i].reviewSummary = summaries[i];
      }
      this.init_loading--;
    });
  }

  addToCartClick(idx: number){
    this.userService.user.cartItemCount++;
    let product = this.visibleProducts[idx];
    if(this.userService.user.loggedIn){
      this.userService.rxOnBackendId$(z => {
        this.snackBar.open(product.name + " is added to the cart")._dismissAfter(2000);
        return this.cartRestService.addCartItem(product.id, 1, z);
      }).subscribe();
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
      this.snackBar.open(product.name + " is added to the cart")._dismissAfter(2000);
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
    this.computeSortedProducts();
    this.computeVisibleProducts();
  }

  protected onSelectForAnimal(event: MatChipListboxChange) {
    if(event.value == null)
      this.for_animal = "none"
    else
      this.for_animal = event.value;
    this.pageIndex = 0;
    this.computeFilteredProducts();
    this.computeSortedProducts();
    this.computeVisibleProducts();
  }

  searchTerm: string = "";

  protected search() {
    this.pageIndex = 0;
    this.computeFilteredProducts();
    this.computeSortedProducts();
    this.computeVisibleProducts();
  }

  sortByParam: string = "none";
  descending: boolean = false;

  protected computeSortedProducts(): void {
    let flip = this.descending ? -1 : 1;
    switch (this.sortByParam) {
      case "none": this.filtered_products.sort((a, b) => flip * (a.id - b.id)); break;
      case "price": this.filtered_products.sort((a, b) => flip * (a.price - b.price)); break;
      case "popularity": this.filtered_products.sort((a, b) => flip * (a.reviewSummary.count - b.reviewSummary.count)); break;
      case "rating": this.filtered_products.sort((a, b) => flip* (a.reviewSummary.rating - b.reviewSummary.rating)); break;
    }
  }

  onSort(){
    this.pageIndex = 0;
    this.computeFilteredProducts();
    this.computeSortedProducts();
    this.computeVisibleProducts();
  }
}
