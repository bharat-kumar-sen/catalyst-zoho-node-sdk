import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  baseUrl: string = environment.baseUrl;
  users = 'users';
  sendVideo: any;

  constructor(private apiService: ApiService) { }

  public updateUserDetails(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/update`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public saveUserInfo(param: any): Observable<any> {
      return this.apiService.post(`${this.users}/saveUserInfo`, param).pipe(
        map((data: any) => {
          return data;
        })
      );
  }
  public saveUserInfoWithphoto(param: any): Observable<any> {
      return this.apiService.post(`${this.users}/upload`, param).pipe(
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
    return this.apiService.post(`${this.users}/doSignIn`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public emailAlreadyExists(param: any): any {
    return this.apiService.post(`${this.users}/emailAlreadyExists`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public forgotPassword(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/forgotPassword`, param).pipe(
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
    return this.apiService.get(`${this.users}/logout`).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public deleteUser(param: any): Observable<any> {
    return this.apiService.delete(`${this.users}/delete/`+param.ROWID).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public getUsersList(params?: object): Observable<any> {
    return this.apiService.post(`${this.users}/list`, params).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public getPdfContent1(): Observable<any> {
    return this.apiService.get(`${this.users}/getPdfContent1`).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public getUsersListServer(params: any): Observable<any> {
    return this.apiService.post(`${this.users}/getUsersListServer`, params).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public getCustomDTUsersListServer(params?: any): Observable<any> {
    return this.apiService.post(`${this.users}/getCustomDTUsersListServer`, params).pipe(
      map((data: any) => {
        return data;
      })
    )
  }

  public searchUserData(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/searchUserData`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public getUserInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/getUserInfo`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public addingNewUser(param: object): any {
    console.log("today data in service", param);
    return this.apiService.post(`${this.users}/profileUpdate`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  public addProfileImageWithUserInfo(param: object): any {
    console.log("today data in service", param);
    return this.apiService.post(`${this.users}/addProfileImageWithUserInfo`, param).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

}
