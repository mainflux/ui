import { Injectable } from '@angular/core';
import { action, observable } from 'mobx';

import { GatewaysService } from 'app/common/services/gateways/gateways.service';
import { Gateway } from 'app/common/interfaces/gateway.interface';
import { UiStore } from './ui.store';

@Injectable()
export class GatewaysStore {
  @observable gateways: Gateway[] = [];
  offset = 0;
  limit = 20;

  constructor(
    private uiState: UiStore,
    private gatewaysService: GatewaysService,
  ) { }

  @action
  getGateways(offset: number, limit: number) {
    this.uiState.loading = true;
    this.gatewaysService.getGateways(offset, limit)
      .subscribe((resp: any) => {
        this.uiState.loading = false;
        this.gateways = resp.gateways;
      }, () => {
        this.uiState.loading = false;
        window.confirm('Failed to fetch Gateways');
      });
  }

  @action
  addGateway(name: string, mac: string) {
    this.uiState.loading = true;
    this.gatewaysService.addGateway(name, mac)
      .subscribe(() => {
        this.uiState.loading = false;
        this.getGateways(this.offset, this.limit);
      }, () => {
        this.uiState.loading = false;
        window.confirm('Failed to add Gateway');
      });
  }

  @action
  editGateway(name: string, mac: string, gw: Gateway) {
    this.uiState.loading = true;
    this.gatewaysService.editGateway(name, mac, gw)
      .subscribe(() => {
        this.uiState.loading = false;
        this.getGateways(this.offset, this.limit);
      }, () => {
        this.uiState.loading = false;
        window.confirm('Failed to edit Gateway');
      });
  }

  @action
  deleteGateway(gateway: Gateway) {
    this.uiState.loading = true;
    this.gatewaysService.deleteGateway(gateway)
      .subscribe(() => {
        this.uiState.loading = false;
        this.getGateways(this.offset, this.limit);
      }, () => {
        this.uiState.loading = false;
      });
  }
}
