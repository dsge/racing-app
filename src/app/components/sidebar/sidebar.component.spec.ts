import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { of, take } from 'rxjs';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: Router;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideMockSupabaseClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('items$', () => {
    it('should return some items', (done: DoneFn) => {
      fixture.detectChanges();
      component.items$.pipe(take(1)).subscribe((items: MenuItem[]) => {
        expect(items.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should navigate on logout click', (done: DoneFn) => {
      router.navigate = jasmine.createSpy();
      userService.signOut = jasmine.createSpy().and.returnValue(of(null));
      fixture.detectChanges();
      component.items$.pipe(take(1)).subscribe((items: MenuItem[]) => {
        const logoutMenuItem: MenuItem = items.find(
          (item: MenuItem) => item.icon === PrimeIcons.SIGN_OUT
        )!;
        logoutMenuItem.command?.({});
        expect(router.navigate).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
