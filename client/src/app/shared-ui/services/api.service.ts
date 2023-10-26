import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { JwtService } from '..';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiBase = environment.baseUrl;
  headers: any = {};
  constructor(private httpClient: HttpClient, private jwtService: JwtService, private toastr: ToastrService) { }

  post(url: string, param?: any): Observable<any> {
    const apiURL = this.apiBase + url;
    // let headers = this.getHeader();
    return this.httpClient
      .post(apiURL, param)
      .pipe(
        map((res) => res),
        catchError(async (error) => this.errorHandling(error))
      );
  }

  get(url: string): Observable<any> {
    const apiUrl = this.apiBase + url;
    // let headers = this.getHeader();
    return this.httpClient.get(apiUrl).pipe(
      map((res) => res),
      catchError(async (error) => this.errorHandling(error))
    );
  }

  delete(url: string, param?: any): Observable<any> {
    // let headers = this.getHeader();
    const apiURL = this.apiBase + url;
    return this.httpClient
      .delete(apiURL, param)
      .pipe(
        map((res) => res),
        catchError(async (error) => this.errorHandling(error))
      );
  }

  put(url: string, param?: any): Observable<any> {
    const apiURL = this.apiBase + url;
    // let headers = this.getHeader();
    return this.httpClient
      .put(apiURL, param)
      .pipe(
        map((res) => res),
        catchError(async (error) => this.errorHandling(error))
      );
  }

  deletePost(url?: any): Observable<any> {
    // let headers = this.getHeader();
    const apiURL = this.apiBase + url;
    return this.httpClient
      .delete(apiURL)
      .pipe(
        map((res) => res),
        catchError(async (error) => this.errorHandling(error))
      );
  }

  getHeader() {
    return new HttpHeaders({
      authorization: this.jwtService.getToken()
        ? this.jwtService.getToken()
        : environment.cookieToken,
    });
  }

  private errorHandling(error: HttpErrorResponse): HttpErrorResponse {
    switch (error.status) {
      case 401: {
        this.jwtService.destroyToken();
        this.toastr.error(error.error.message);
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
        return error
      }
    }
  }
}
