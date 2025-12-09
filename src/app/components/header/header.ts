import {Component, inject} from '@angular/core';
import {AppState} from '../../store/state';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  state = inject(AppState);
  router = inject(Router);

  goToUserCreation(){
    this.router.navigate(['/create-user']);
  }

  goToUserSummary(){
    this.router.navigate(['/user-summary']);
  }

  goToHome(){
    this.router.navigate(['']);
  }
}
