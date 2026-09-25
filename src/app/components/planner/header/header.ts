import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {AppState} from '../../../store/state';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.scss',
})
export class Header {
  state = inject(AppState);
  router = inject(Router);

  goToUserCreation(){
    this.router.navigate(['/create-user']);
  }

  goToHome(){
    this.router.navigate(['']);
  }
}
