import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyFooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MyFooterComponent],
  template: `
  <router-outlet></router-outlet>
  <my-footer></my-footer>
  `
})
export class AppComponent {}
