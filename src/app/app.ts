import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/header/header';
import {AppState} from './store/state';
import {FormsModule} from '@angular/forms';
import { getFunctions, httpsCallable } from '@angular/fire/functions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  state = inject(AppState);

  passwort = signal<string>('');
  login = computed(this.state.loggedIn);

  ngOnInit() {
    this.state.loadUsers();
    this.state.loadCards();
    const functions = getFunctions();
    const helloFn = httpsCallable(functions, 'hello');

    helloFn({}).then(result => {
      // @ts-ignore
      console.log(result.data.text);
    });
  }

  constructor() {
    effect(() => {
      const passwort = this.passwort();
      this.state.loginToApp(passwort);
    })
  }
}
