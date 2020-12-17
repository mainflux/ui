import { Injectable } from '@angular/core';

@Injectable()
export class IntervalService {
  id: number;
  defaultInterval: number = 1000 * 2; // ms * sec

  constructor() {}

  set(context: any, callback: { bind: (arg0: any) => TimerHandler; }, interval?: number) {
    interval = interval || this.defaultInterval;
    
    if (!this.id) {
      this.id = window.setInterval(callback.bind(context), interval);
    }    
  }

  remove() {
    this.id && window.clearInterval(this.id);
  }
}