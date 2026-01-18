import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/header/header';
import {AppState} from './store/state';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  state = inject(AppState);

  password = signal<string>('');
  login = computed(this.state.loggedIn);

  ngOnInit() {
    this.state.loadUsers();
    this.state.loadCards();
    this.state.loadHeading();
  }

  constructor() {
    effect(() => {
      const passwort = this.password();
      this.state.loginToApp(passwort);
    })
  }
}
