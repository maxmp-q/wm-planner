import {Component, computed, inject, OnInit, signal} from '@angular/core';
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
  login = computed(()=> this.password() === "WM2025");

  ngOnInit() {
    this.state.loadUsers();
    this.state.loadCards();
  }
}
