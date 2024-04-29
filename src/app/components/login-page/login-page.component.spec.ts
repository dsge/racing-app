import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let userService: UserService;
  let router: Router;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideMockSupabaseClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    toastService = TestBed.inject(ToastService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('loginWithEmail', () => {
    it('should navigate the user on successful login', () => {
      userService.signInWithPassword = jasmine.createSpy().and.returnValue(of({}))
      router.navigate = jasmine.createSpy();
      component.loginWithEmail();
      expect(router.navigate).toHaveBeenCalled();
    })
    it('should display a toast on failed login', () => {
      userService.signInWithPassword = jasmine.createSpy().and.returnValue(of({ error: {} }))
      toastService.add = jasmine.createSpy();
      component.loginWithEmail();
      expect(toastService.add).toHaveBeenCalled();
    })
  });

  describe('signOut', () => {
    it('should call userservice signout', () => {
      userService.signOut = jasmine.createSpy().and.returnValue(of(null));
      component.signOut();
      expect(userService.signOut).toHaveBeenCalledTimes(1);
    })
  });
});
