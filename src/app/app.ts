import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/planner/header/header';
import {AppState} from './store/state';
import {FormsModule} from '@angular/forms';
import {Toaster} from './components/toaster/toaster';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, FormsModule, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  state = inject(AppState);

  password = signal<string>(sessionStorage.getItem('login') ?? '');
  login = computed(() => this.state.loggedIn());

  ngOnInit() {
    this.state.loadUsers();
    this.state.loadCards();
    this.state.loadHeading();
  }

  loginButton(){
    const password = this.password();
    this.state.loginToApp(password);
    sessionStorage.setItem('login', password);
  }
}
