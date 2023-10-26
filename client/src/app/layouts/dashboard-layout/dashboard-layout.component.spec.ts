import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLayoutComponent } from './dashboard-layout.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedUiModule } from 'src/app/shared-ui';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DashboardLayoutComponent', () => {
  let component: DashboardLayoutComponent;
  let fixture: ComponentFixture<DashboardLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardLayoutComponent, DashboardSidebarComponent],
      imports:[
        HttpClientTestingModule,
        SharedUiModule,
        RouterModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(DashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
