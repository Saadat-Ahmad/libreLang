import { Component } from '@angular/core';

@Component({
  selector: 'my-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class MyFooterComponent {
  year = new Date().getFullYear();
}