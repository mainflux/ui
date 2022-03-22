import { Component, OnInit } from '@angular/core';

import { UsersService } from 'app/common/services/users/users.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { UserProfile } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = {};

  newPassword: string = '';
  confirmPassword: string = '';
  oldPassword: string = '';
  ngxAdminMinPasswordSize = 6;

  constructor(
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.profile.picture = this.usersService.getUserPicture();

    this.usersService.getProfile().subscribe(
      resp => {
        this.profile.email = resp.email ? resp.email : '';

        if (resp.metadata !== undefined) {
          this.profile = resp.metadata.profile ? resp.metadata.profile : {};
        }
      },
    );
  }

  onClickSaveInfos(event): void {
    const userReq = {
      metadata: {
        profile: this.profile,
      },
    };

    this.usersService.editUser(userReq).subscribe(
      resp => {
        this.notificationsService.success('User successfully edited', '');
      },
    );
  }

  onClickSavePassword(event): void {
    if (this.newPassword.length < this.ngxAdminMinPasswordSize) {
      this.notificationsService.warn('Password must be at least 6 characters long.', '');
      return;
    }

    if (this.newPassword === this.confirmPassword) {
      const passReq = {
        password: this.newPassword,
        old_password: this.oldPassword,
      };

      this.usersService.changeUserPassword(passReq).subscribe(
        resp => {
          this.notificationsService.success('Password successfully changed', '');
        },
      );
    } else {
      this.notificationsService.warn('New password and Confirmation password do not match.', '');
    }
  }
}
