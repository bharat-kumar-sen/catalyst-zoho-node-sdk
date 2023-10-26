// import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { GlobalService, JwtService, currentUser } from 'src/app/shared-ui';

@Component({
  selector: 'app-dashboard-topnav',
  templateUrl: './dashboard-topnav.component.html',
  styleUrls: ['./dashboard-topnav.component.scss']
})
export class DashboardTopnavComponent implements OnInit {

  adminRole: any = 3;
  supplireRole: any = 2;
  customerRole: any = 1;
  breadcrumbs: string[] = [];
  subscription: Subscription = new Subscription();
  currentUser: currentUser = new currentUser();
  addDesktopClass: boolean = true;
  addMobClass: boolean = false;

  constructor(
    // private socialAuthService: SocialAuthService,
    private breadcrumbService: GlobalService,
    private globalService: GlobalService,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe((breadcrumbs) => {
      // console.log("breadcrumbs========", breadcrumbs);
      this.breadcrumbs = breadcrumbs;
    });

    this.currentUser = this.jwtService.getCurrentUser();
    this.globalService.destroySession();
    this.subscription = this.globalService
      .getActionChildToParent()
      .subscribe((message) => {
        if (message) {
          this.currentUser = this.jwtService.getCurrentUser();
          if (message.text === 'show') {
            this.toggleClass();
          }
        }
      });

    console.log('currentUser---->', this.currentUser);
    if (this.currentUser.role == this.adminRole) {
      this.currentUser.role = 'Admin';
    } else if (this.currentUser.role == this.supplireRole) {
      this.currentUser.role = 'Supplire';
    } else if (this.currentUser.role == this.customerRole) {
      this.currentUser.role = 'Customer'
    }
  }

  toggleClass() {
    if (window.innerWidth > 992) {
      // add and remove class on desktop version
      if (!this.addDesktopClass) {
        this.addDesktopClass = true;
      } else {
        this.addMobClass = false;
        this.addDesktopClass = false;
      }
    } else {
      // add and remove class on mobile version
      if (this.addMobClass) {
        this.addMobClass = false;
      } else {
        this.addMobClass = true;
      }
    }
  }

  logout() {
    this.jwtService.destroyToken();
    this.globalService.logOut();
    // this.socialAuthService.signOut();
    this.router.navigate(['/login']);
    this.toastr.success('You have logged out successfully. ', 'Success');
  }

}
