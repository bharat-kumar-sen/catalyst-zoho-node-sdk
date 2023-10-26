import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  baseUrl: string = environment.baseUrl;
  suppliers = 'suppliers';

  constructor(private apiService: ApiService) { }

  public saveSupplierInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.suppliers}/saveSupplierInfo`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public getSupplierInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.suppliers}/getSuppliersList`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public deleteSupplier(param: object): Observable<any> {
    return this.apiService.delete(`${this.suppliers}/deleteSupplier`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
