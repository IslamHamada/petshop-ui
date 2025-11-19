import {inject, Injectable} from '@angular/core';
import {Product} from '../models/Product';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductRestAPI {
  http = inject(HttpClient);

  getAllProducts() {
    return this.http.get<Product[]>('http://localhost:9090/product');
  }

  getProductById(id: number) {
    return this.http.get<Product>(`http://localhost:9090/product/${id}`);
  }
}
