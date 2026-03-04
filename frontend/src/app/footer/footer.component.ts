import { Component } from '@angular/core';

@Component({
  selector: 'my-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
})
export class MyFooterComponent {
  year = new Date().getFullYear();
}