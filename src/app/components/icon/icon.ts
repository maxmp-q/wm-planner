import {Component, computed, input} from '@angular/core';

const icons = [
  "arrow_right",
  "arrow_down",
  "menu_dots",
  "delete"
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
  viewbox = input<string>('16');

  _viewbox = computed(() => {
    switch(this.viewbox()){
      case '16': return '0 0 16 16';
      case '24': return '0 0 24 24';
      case '1024': return '0 0 1024 1024';
      default: return '0 0 16 16';
    }
  })
}
