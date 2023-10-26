import { Component, OnInit } from '@angular/core';
import { UserLogin } from './login.model';
import { GlobalService, JwtService, UsersService, currentUser } from 'src/app/shared-ui';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginObject: UserLogin = new UserLogin();

  user!: SocialUser;
  loggedIn?: boolean;
  authData: any;
  currentUser: currentUser = new currentUser();
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private jwtService: JwtService,
    private spinner: NgxSpinnerService,
    private usersService: UsersService,
    private globalService: GlobalService,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.jwtService.getCurrentUser();
    if(this.currentUser) {
      this.router.navigate(['/dashboard']);
    }
    let rememberMeCookie = this.jwtService.getCookie(environment.cookieToken);
    if (rememberMeCookie) {
      this.loginObject = rememberMeCookie;
    }
  }

  doLogin() {
    let loginPostData = this.loginObject;
    if (loginPostData.remember) {
      this.jwtService.setCookie(environment.cookieToken, loginPostData);
    } else {
      this.jwtService.deleteCookie(environment.cookieToken);
    }
    let postData = Object.assign({}, loginPostData);
    delete postData.remember;
    this.spinner.show();
    this.usersService.doSignIn(postData).subscribe(
      (data: any) => {
        this.spinner.hide();
        if (data.status == 200) {
          let userDetails = data.data;
          userDetails.sesionStartTime = new Date();
          this.toastr.success(data.message, 'Success');
          this.jwtService.saveToken(userDetails.authorization);
          this.jwtService.saveCurrentUser(JSON.stringify(userDetails));
          this.jwtService.getCurrentUser();
          if (userDetails && userDetails.role) {
            this.router.navigate(['/dashboard']);
            this.globalService.sendActionChildToParent('');
          } else {
            this.router.navigate(['/login']);
          }
        } else {
          this.toastr.error(data.message, 'Error');
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.globalService.sendActionChildToParent('');
        this.toastr.error(error.message, 'Error');
      }
    )
  }

}
