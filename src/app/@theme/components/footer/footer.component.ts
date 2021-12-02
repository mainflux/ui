import { Component } from '@angular/core';
import { STRINGS } from 'assets/text/strings';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      <b><a href="https://mainflux.com" target="_blank">Mainflux</a></b> {{ currentYear }}
    </span>
    <div class="socials">
    <a href="https://github.com/mainflux/mainflux" target="_blank" class="ion ion-social-github"></a>
    <a href="https://www.facebook.com/mainflux" target="_blank" class="ion ion-social-facebook"></a>
    <a href="https://twitter.com/mainflux" target="_blank" class="ion ion-social-twitter"></a>
    <a href="https://www.linkedin.com/company/mainflux" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
  disclaimer: string = STRINGS.footer.disclaimer;
  currentYear: number = new Date().getFullYear();
}
