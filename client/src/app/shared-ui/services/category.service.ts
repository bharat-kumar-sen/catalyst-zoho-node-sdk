import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl: string = environment.baseUrl;
  categorys = 'category';
  sendVideo: any;

  constructor(private apiService: ApiService) { }

  public getCategorysList(params?: object): Observable<any> {
    return this.apiService.post(`${this.categorys}/list`, params).pipe(
      map((data) => {
        return data;
      })
    );
  }

}
