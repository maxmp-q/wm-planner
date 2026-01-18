import {Component, inject} from '@angular/core';
import {ToasterState} from '../../store/toaster';

@Component({
  selector: 'app-toaster',
  imports: [],
  templateUrl: './toaster.html',
  styleUrl: './toaster.scss',
})
export class Toaster {
  toaster = inject(ToasterState)
}
