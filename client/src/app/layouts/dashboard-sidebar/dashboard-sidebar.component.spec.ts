import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSidebarComponent } from './dashboard-sidebar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedUiModule } from 'src/app/shared-ui';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardSidebarComponent', () => {
  let component: DashboardSidebarComponent;
  let fixture: ComponentFixture<DashboardSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardSidebarComponent],
      imports: [
        HttpClientTestingModule,
        SharedUiModule,
        RouterModule,
        RouterTestingModule,
      ],
    });
    fixture = TestBed.createComponent(DashboardSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
