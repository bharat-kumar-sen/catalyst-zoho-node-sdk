import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl: string = environment.baseUrl;
  products = 'products';

  constructor(private apiService: ApiService) { }

  public saveProductInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.products}/saveProductInfo`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public getProductInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.products}/getProductsList`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public deleteProduct(param: object): Observable<any> {
    return this.apiService.delete(`${this.products}/deleteProduct`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

}
