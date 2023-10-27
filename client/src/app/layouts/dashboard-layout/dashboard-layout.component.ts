import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { GlobalService, JwtService, currentUser } from 'src/app/shared-ui';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit, AfterViewInit {
  body: any = '';
  className: any = '';
  sidenav: any = '';
  iconSidenav: any = '';
  html: any = '';
  referenceButtons: any = '';
  iconNavbarSidenav: any = '';

  isloginComp: boolean = false;
  subscription: Subscription = new Subscription();
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.navbarColorOnResize();
  }
  currentUser: currentUser = new currentUser();

  ngOnInit(): void {
    this.currentUser = this.jwtService.getCurrentUser();
  }
  constructor(
    private router: Router,
    private globalService: GlobalService,
    private jwtService: JwtService
  ) {
    this.subscription = this.globalService
      .getActionChildToParent()
      .subscribe(async (message) => {
        this.currentUser = this.jwtService.getCurrentUser();
        if (message) {
          if (this.currentUser) {
            timer(2000).subscribe(() => {
              this.loadSideTop();
            });
          }
        }
      });
  }

  ngAfterViewInit(): void {
    this.loadSideTop();
  }

  loadSideTop() {
    this.body = document.getElementsByTagName('body')[0];
    this.className = 'g-sidenav-pinned';
    this.sidenav = document.getElementById('sidenav-main');
    this.iconSidenav = document.getElementById('iconSidenav');
    this.html = document.getElementById('iconSidenav');

    this.referenceButtons = document.querySelector('[data-class]');
    this.iconNavbarSidenav = document.getElementById('iconNavbarSidenav');
    this.iconNavbarSidenav?.addEventListener('click', () => this.toggleSidenav());
    this.iconSidenav?.addEventListener('click', () => this.toggleSidenav());
    if (this.html) {
      this.html.addEventListener('click', (e: any) => this.closeSidenav(e));
    }
  }

  toggleSidenav(): void {
    if (this.body.classList.contains(this.className)) {
      this.body.classList.remove(this.className);
      setTimeout(() => {
        this.sidenav.classList.remove('bg-white');
      }, 100);
      this.sidenav.classList.remove('bg-transparent');
    } else {
      this.body.classList.add(this.className);
      this.sidenav.classList.add('bg-white');
      this.sidenav.classList.remove('bg-transparent');
      this.iconSidenav?.classList.remove('d-none');
    }
  }

  closeSidenav(e: any): void {
    if (this.body.classList.contains(this.className)
      && !e.target.classList.contains('sidenav-toggler-line')) {
      this.body.classList.remove(this.className);
    }
  }

  navbarColorOnResize(): void {
    if (window.innerWidth > 1200) {
      if (this.referenceButtons?.classList.contains('active')
        && this.referenceButtons.getAttribute('data-class') === 'bg-transparent') {
        this.sidenav.classList.remove('bg-white');
      } else if (!this.body.classList.contains('dark-version')) {
        this.sidenav.classList.add('bg-white');
      }
    } else {
      this.sidenav.classList.add('bg-white');
      this.sidenav.classList.remove('bg-transparent');
    }
  }
}
