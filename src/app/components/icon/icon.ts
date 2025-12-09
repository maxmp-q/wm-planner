import {Component, input} from '@angular/core';

const icons = [
  "arrow_right",
  "arrow_down"
]
type IconType = typeof icons[number];

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  which = input<IconType>();
  height = input<string>('24px');
  width = input<string>('24px');
}
