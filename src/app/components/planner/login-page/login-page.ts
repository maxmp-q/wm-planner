import {Component, HostListener, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppState} from '../../../store/state';


@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  state = inject(AppState);

  password = signal<string>(sessionStorage.getItem('login') ?? '');

  @HostListener('window:keydown.enter')
  loginButton(){
    const password = this.password();
    this.state.loginToApp(password);
    sessionStorage.setItem('login', password);
  }
}
