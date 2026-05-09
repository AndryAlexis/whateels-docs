import { Component, input } from '@angular/core';

@Component({
  selector: 'app-item',
  imports: [],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item {
  href = input<string>('Item Link');
  name = input<string>('Item Name');
  isActive = input<boolean>(false);
}
