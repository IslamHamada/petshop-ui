import {inject, Injectable} from '@angular/core';
import {Product} from '../models/Product';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environment/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductRestAPI {
  http = inject(HttpClient);

  getAllProducts() {
    return this.http.get<Product[]>(`${environment.gatewayUrl}/product`);
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${environment.gatewayUrl}/product/${id}`);
  }
}
