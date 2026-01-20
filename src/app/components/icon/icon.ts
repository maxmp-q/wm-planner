import {Component, computed, input} from '@angular/core';

const icons = [
  "arrow_right",
  "arrow_down",
  "menu_dots",
  "delete"
]
export type IconType = (typeof icons)[number];

const viewboxes: Record<IconType, string> = {
  "arrow_right" : "0 0 24 24",
  "arrow_down" : "0 0 24 24",
  "menu_dots" : "0 0 16 16",
  "delete": "0 0 1024 1024"
}

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  which = input<IconType>('');
  height = input<string>('24px');
  width = input<string>('24px');
  viewbox = computed(()=> viewboxes[this.which()] ?? "0 0 16 16");
}
