import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiServerLessService } from './api-server-less.service';

@Injectable({
  providedIn: 'root',
})
export class ServerlessUsersService {

  users = 'users';
  sendVideo: any;

  constructor(private apiService: ApiServerLessService) { }

  public updateUserDetails(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/update`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public saveUserInfo(param: any): Observable<any> {
      return this.apiService.post(`${this.users}?api_type=saveUserInfo`, param).pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  public loginWithGoogle(param: object): Observable<any> {
    return this.apiService.post(`auth`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public doSignIn(param: object): any {
    return this.apiService.post(`${this.users}?api_type=doSignIn`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public emailAlreadyExists(param: any): any {
    return this.apiService.post(`${this.users}?api_type=emailAlreadyExists`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public forgotPassword(param: object): Observable<any> {
    return this.apiService.post(`${this.users}?api_type=forgotPassword`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public authentication(param?: object): Observable<any> {
    return this.apiService.post(`${this.users}/authentication`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public logout(param?: object): Observable<any> {
    return this.apiService.get(`${this.users}?api_type=logout`).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public deleteUser(param: any): Observable<any> {
    return this.apiService.post(`${this.users}?api_type=deleteUser`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public getUsersList(params?: object): Observable<any> {
    return this.apiService.post(`${this.users}?api_type=getUsersList`, params).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
}
