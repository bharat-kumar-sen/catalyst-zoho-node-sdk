import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  baseUrl: string = environment.baseUrl;
  orders = 'orders';

  constructor(private apiService: ApiService) { }

  public saveOrderInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.orders}/saveOrderInfo`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public getOrdersList(param: object): Observable<any> {
    return this.apiService.post(`${this.orders}/getOrdersList`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public deleteOrder(param: object): Observable<any> {
    return this.apiService.delete(`${this.orders}/deleteOrder`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

}
