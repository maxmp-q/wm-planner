import {Component, computed, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/planner/header/header';
import {AppState} from './store/state';
import {FormsModule} from '@angular/forms';
import {Toaster} from './components/toaster/toaster';
import { UserState } from './store/userState';
import {CardState} from './store/cardState';
import {LoginPage} from './components/planner/login-page/login-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, FormsModule, Toaster, LoginPage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  state = inject(AppState);
  userState = inject(UserState);
  cardState = inject(CardState);

  login = computed(() => this.state.loggedIn());

  ngOnInit() {
    this.userState.loadUsers();
    this.cardState.loadCards();
    this.state.loadHeading();
  }
}
