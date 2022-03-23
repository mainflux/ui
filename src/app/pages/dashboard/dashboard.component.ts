import { Component, OnInit } from '@angular/core';
import { STRINGS } from 'assets/text/strings';
import { UsersService } from 'app/common/services/users/users.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { User, PageFilters, TablePage, DashboardConf, CardConf } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  user: User;
  title: string = STRINGS.home.title;
  description: string = STRINGS.home.description;

  pageFilters: PageFilters = {};

  page: TablePage = {};
  dashboardConf: DashboardConf = {
    cards: [{}],
    mainfluxIntro: true,
  };

  constructor(
    private usersService: UsersService,
    private channelsService: ChannelsService,
  ) { }

  ngOnInit() {
    this.usersService.getProfile().subscribe(
      (resp: User) => {
        this.user = resp;
        if (this.user.metadata.dashboardConf) {
           this.dashboardConf = this.user.metadata.dashboardConf;
        }
      },
    );

    this.channelsService.getChannels(this.pageFilters).subscribe(
      (resp: any) => {
        this.page.rows = resp.channels;
      },
    );
  }

  onCreateCard() {
    const card: CardConf = {
      mode: 'json',
    };
    this.dashboardConf.cards.push(card);
  }

  onSaveConfig(config: CardConf, i: number) {
    this.dashboardConf.cards[i] = config;
    this.user.metadata.dashboardConf = this.dashboardConf;
    this.usersService.editUser(this.user).subscribe();
  }

  onDeleteConfig(i: number) {
    this.dashboardConf.cards.splice(i, 1);
    this.user.metadata.dashboardConf = this.dashboardConf;
    this.usersService.editUser(this.user).subscribe();
  }

  onCloseWelcome() {
    this.user.metadata.dashboardConf.mainfluxIntro = false;
    this.usersService.editUser(this.user).subscribe();
  }
}
