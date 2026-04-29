import {Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/planner/header/header';
import {AppState} from './store/state';
import {FormsModule} from '@angular/forms';
import {Toaster} from './components/toaster/toaster';
import { UserState } from './store/userState';
import {CardState} from './store/cardState';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, FormsModule, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  state = inject(AppState);
  userState = inject(UserState);
  cardState = inject(CardState);

  password = signal<string>(sessionStorage.getItem('login') ?? '');
  login = computed(() => this.state.loggedIn());

  ngOnInit() {
    this.userState.loadUsers();
    this.cardState.loadCards();
    this.state.loadHeading();
  }

  @HostListener('window:keydown.enter')
  loginButton(){
    const password = this.password();
    this.state.loginToApp(password);
    sessionStorage.setItem('login', password);
  }
}
