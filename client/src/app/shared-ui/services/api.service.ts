import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { GlobalService, JwtService } from '..';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiBase = environment.baseUrl;
  headers: any = {};
  constructor(
    private httpClient: HttpClient,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private router: Router,
    // private globalService: GlobalService
  ) {}

  post(url: string, param?: any): Observable<any> {
    const apiURL = this.apiBase + url;
    let headers = this.getHeader();
    return this.httpClient.post(apiURL, param, {headers}).pipe(
      map((res) => res),
      catchError(async (error) => this.errorHandling(error))
    );
  }

  get(url: string): Observable<any> {
    const apiUrl = this.apiBase + url;
    let headers = this.getHeader();
    return this.httpClient.get(apiUrl, {headers}).pipe(
      map((res) => res),
      catchError(async (error) => this.errorHandling(error))
    );
  }

  delete(url: string, param?: any): Observable<any> {
    let headers = this.getHeader();
    const apiURL = this.apiBase + url;
    return this.httpClient.delete(apiURL, {headers}).pipe(
      map((res) => res),
      catchError(async (error) => this.errorHandling(error))
    );
  }

  put(url: string, param?: any): Observable<any> {
    const apiURL = this.apiBase + url;
    let headers = this.getHeader();
    return this.httpClient.put(apiURL, param, {headers}).pipe(
      map((res) => res),
      catchError(async (error) => this.errorHandling(error))
    );
  }

  deletePost(url?: any): Observable<any> {
    let headers = this.getHeader();
    const apiURL = this.apiBase + url;
    return this.httpClient.delete(apiURL, {headers}).pipe(
      map((res) => res),
      catchError(async (error) => this.errorHandling(error))
    );
  }

  getHeader() {
    return new HttpHeaders({
      Authorization: this.jwtService.getToken()
          ? `Bearer ${this.jwtService.getToken()}`
          : '',
    });
  }

  private errorHandling(error: HttpErrorResponse): HttpErrorResponse {
    switch (error.status) {
      case 401: {
        this.jwtService.destroyToken();
        this.toastr.error(error.error.message);
        location.reload();
        // return `Unauthorized: ${error}`;
        return error;
      }
      case 404: {
        // return `Not Found: ${error}`;
        return error;
      }
      case 403: {
        // return `Access Denied: ${error}`;
        return error;
      }
      case 500: {
        // return `Internal Server Error: ${error}`;
        return error;
      }
      default: {
        return error;
      }
    }
  }
}
