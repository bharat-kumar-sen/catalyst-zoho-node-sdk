import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { JwtService, UsersService } from '..';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  private subject = new Subject<any>();
  private progress = new Subject<any>();
  baseUrl: string = environment.baseUrl;
  users = 'users';
  private breadcrumbsSubject = new BehaviorSubject<string[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private titleService: Title,
    private apiService: ApiService,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private router: Router, private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumbs();
      }
    });
  }

  private updateBreadcrumbs() {
    const breadcrumbs: string[] = [];
    let currentRoute = this.activatedRoute.root;
    while (currentRoute.children.length > 0) {
      const childrenRoutes = currentRoute.children;
      const primaryChildRoute = childrenRoutes.find((route) => route.outlet === 'primary');
      if (!primaryChildRoute) {
        break;
      }
      breadcrumbs.push(primaryChildRoute.snapshot.data['breadcrumb']);
      currentRoute = primaryChildRoute;
    }
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  patternMatchRegex(inputVal: any, InputType: string) {
    let RegEx: any = '';
    if (InputType === 'email') {
      RegEx = new RegExp('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$');
    } else if (InputType === 'phoneNumber') {
      RegEx = new RegExp('^((\\+91-?)|0)?[0-9]{10}$');
    } else if (InputType === 'strongPasswordCheck') {
      RegEx = new RegExp(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[^A-Za-z0-9])(?=.*?[0-9]).{8,}$'
      );
    }
    const validRex = RegEx.test(inputVal);
    return validRex;
  }

  getProgress(): Observable<any> {
    return this.progress.asObservable();
  }

  setProgress(action: any | undefined) {
    this.progress.next({ text: action });
  }

  getLoadingLabel(): Observable<any> {
    return this.subject.asObservable();
  }

  setLoadingLabel(action: string) {
    this.subject.next({ text: action });
  }

  sendActionChildToParent(action: any) {
    this.subject.next({ text: action });
  }

  getActionChildToParent(): Observable<any> {
    return this.subject.asObservable();
  }

  authentication() {
    const userInfo = this.jwtService.loggedUserInfo;
    if (userInfo && userInfo.email) {
      const loginInfo = {
        email: userInfo.email,
      };
      this.usersService.authentication(loginInfo).subscribe(
        (data) => {
          if (!data.currentUser) {
            // this.globalService.sendActionChildToParent('stop');
            this.jwtService.destroyToken();
            this.sendActionChildToParent('Logout');
            this.router.navigate(['/login']);
          }
        },
        (error) => { }
      );
    }
  }

  logOut() {
    this.sendActionChildToParent('loggedOut');
    const userInfo = this.jwtService.loggedUserInfo;
    if (userInfo && userInfo.email) {
      const loginInfo = {
        email: userInfo.email,
      };
      this.usersService.logout().subscribe(
        (data) => { },
        (error) => { }
      );
    }
  }

  getPageTitle(title: any) {
    this.titleService.setTitle(title);
  }

  localUpload(image: any, folderName: string) {
    const extension = image.name.substring(image.name.lastIndexOf('.'));
    let fileName = image.name.replace(
      image.name.substr(image.name.lastIndexOf('.')),
      ''
    );
    fileName = fileName.replace(/[.]/g, '');
    let newFileName = fileName.replace(/[.\s]/g, '-') + extension;
    newFileName = newFileName + '###' + folderName;
    const formData = new FormData();
    formData.append('image', image, newFileName);
    return this.httpClient.post(this.baseUrl + 'uploadImage', formData);
  }

  FileUploadProgressBar(file: any) {
    this.setProgress(1)
    const formData = new FormData();
    formData.append('image', file);

    return this.httpClient
      .post(this.baseUrl + 'fileUploadProgress', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            console.log(HttpEventType, 'event=====', event);
            this.setProgress(Math.round((100 / event.total) * event.loaded))
          } else if (event.type == HttpEventType.Response) {
            console.log("HttpEventType.Response", HttpEventType.Response);
            // this.setProgress(null);
            // this.setProgress(null);
          }
        }),
        catchError((err: any) => {
          this.setProgress(null);
          alert(err.message);
          return throwError(err.message);
        })
      )
    // .toPromise();
  }

  UploadAtt(image: any, folderName: string) {
    const extension = image.name.substring(image.name.lastIndexOf('.'));
    let fileName = image.name.replace(
      image.name.substr(image.name.lastIndexOf('.')),
      ''
    );
    fileName = fileName.replace(/[.]/g, '');
    let newFileName = fileName.replace(/[.\s]/g, '-') + extension;
    newFileName = newFileName + '###' + folderName;
    const formData = new FormData();
    formData.append('image', image, newFileName);
    return this.httpClient.post(this.baseUrl + 'uploadImage', formData);
  }

  // this method will destroy our session after 12 hours.
  destroySession() {
    const user = this.jwtService.loggedUserInfo;
    if (user && user.sesionStartTime) {
      let sesionStartTime = new Date(user.sesionStartTime);
      let currentTime = new Date();
      let diff = currentTime.valueOf() - sesionStartTime.valueOf();
      let diffInHours = diff / 1000 / 60 / 60
      diffInHours = Number(diffInHours.toFixed());
      // console.log(environment.sessionTime, "user", diffInHours);
      if (diffInHours > environment.sessionTime) {
        this.jwtService.destroyToken();
      }
    } else {
      this.jwtService.destroyToken();
    }
  }

  patternValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl: any = formGroup.controls[confirmPassword];
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        return confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        return confirmPasswordControl.setErrors(null);
      }
    }
  }

  userEmailValidator(control: AbstractControl) {
    return this.usersService.emailAlreadyExists({ email: control.value }).pipe(
      map((data: any) => {
        return data.status === 200 ? { emailExists: true } : null;
      })
    );
  }

  sendTelegram(formData: FormData): Promise<any> {
    return this.httpClient.post(`${this.baseUrl}sendTelegram`, formData).toPromise();
  }

  sendTwitter(formData: FormData): Promise<any> {
    return this.httpClient.post(`${this.baseUrl}sendTwitter`, formData).toPromise();
  }

  sendFacebook(formData: FormData): Promise<any> {
    return this.httpClient.post(`${this.baseUrl}sendFacebook`, formData).toPromise();
  }
}
