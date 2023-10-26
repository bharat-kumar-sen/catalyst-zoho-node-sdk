import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  baseUrl: string = environment.baseUrl;
  transactions = 'transactions';

  constructor(private apiService: ApiService) { }

  public saveTransactionInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.transactions}/saveTransactionInfo`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public getTransactionsList(param: object): Observable<any> {
    return this.apiService.post(`${this.transactions}/getTransactionsList`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public deleteTransaction(param: object): Observable<any> {
    return this.apiService.delete(`${this.transactions}/deleteTransaction`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

}
