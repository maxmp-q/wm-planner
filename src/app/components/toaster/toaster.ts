import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {ToasterState} from '../../store/toaster';

@Component({
  selector: 'app-toaster',
  imports: [],
  templateUrl: './toaster.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './toaster.scss',
})
export class Toaster {
  toaster = inject(ToasterState)
}
