import { Injectable } from '@angular/core';

type Callback = () => void;

@Injectable()
export class IntervalService {
  ids: number[] = [];
  callbacks: Callback[] = [];
  defaultInterval: number = 1000 * 5; // ms * sec

  constructor() {}

  set(context: any, callback: Callback, interval?: number) {
    if (this.callbacks.indexOf(callback) > -1) {
      return;
    }
    this.callbacks.push(callback);

    interval = interval || this.defaultInterval;

    const id = window.setInterval(callback.bind(context), interval);
    this.ids.push(id);
  }

  remove() {
    this.ids.forEach(id => window.clearInterval(id));
  }
}
