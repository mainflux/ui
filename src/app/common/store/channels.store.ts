import { Injectable } from '@angular/core';
import { action, observable } from 'mobx';

import { ChannelsService } from 'app/common/services/channels/channels.service';
import { Channel } from 'app/common/interfaces/mainflux.interface';
import { UiStore } from './ui.store';

@Injectable()
export class ChannelsStore {
    @observable channels: Channel[] = [];
    offset = 0;
    limit = 20;

    constructor(
        private uiState: UiStore,
        private channelsService: ChannelsService,
    ) { }

    @action
    getChannels(offset: number, limit: number, type?: string) {
        this.uiState.loading = true;
        this.channelsService.getChannels(this.offset, this.limit, type)
            .subscribe((resp: any) => {
                this.uiState.loading = false;
                this.channels = resp.channels;
            }, () => {
                this.uiState.loading = false;
            });
    }

    @action
    addChannel(channel: Channel) {
        this.uiState.loading = true;
        this.channelsService.addChannel(channel)
            .subscribe(
              resp => {
                this.uiState.loading = false;
                this.getChannels(this.offset, this.limit);
              },
              err => {
                this.uiState.loading = false;
                window.confirm('error');
            });
    }

    @action
    editChannel(channel: Channel) {
        this.uiState.loading = true;
        this.channelsService.editChannel(channel)
            .subscribe(
              data => {
                this.uiState.loading = false;
                this.getChannels(this.offset, this.limit);
              },
              err => {
                this.uiState.loading = false;
                window.confirm('error');
            });
    }

    @action
    deleteChannel(channel: Channel) {
        this.uiState.loading = true;
        this.channelsService.deleteChannel(channel.id)
            .subscribe(() => {
                this.uiState.loading = false;
                this.getChannels(this.offset, this.limit);
            }, () => {
                this.uiState.loading = false;
            });
    }
}
