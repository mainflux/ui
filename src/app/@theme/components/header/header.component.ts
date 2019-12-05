import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from 'app/@core/utils';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { User } from 'app/common/interfaces/mainflux.interface';
import { UsersService } from 'app/common/services/users/users.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: User;

  /* themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ]; */

  nebularTheme = 'corporate';

  private subscriptions: Subscription[] = [];
  userMenu = [{ title: 'Profile' }, { title: 'Log out', link: '/auth/logout' }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private usersService: UsersService,
    private layoutService: LayoutService,
    private themeService: NbThemeService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.changeTheme(this.nebularTheme);
    this.nebularTheme = this.themeService.currentTheme;

    this.usersService.getUser().subscribe(
      resp => {
        this.user = resp;
        this.user.picture = this.usersService.getUserPicture();
      },
    );

    const menuSubscription: Subscription = this.menuService.onItemClick()
      .subscribe(({ item }) => {
        if (item.title === 'Profile') {
          this.router.navigateByUrl('/pages/profile');
        }
      });

    this.subscriptions.push(menuSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
