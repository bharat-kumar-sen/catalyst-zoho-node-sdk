import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from '..';
@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(public jwtService: JwtService) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        // Authorization: `${this.jwtService.getToken()}`,
        Authorization: this.jwtService.getToken()
          ? `Bearer ${this.jwtService.getToken()}`
          : '',
      },
    });
    return next.handle(request);
  }
}
