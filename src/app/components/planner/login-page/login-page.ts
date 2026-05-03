import {Component, HostListener, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppState} from '../../../store/state';
import {ToasterState} from '../../../store/toaster';


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
  toaster = inject(ToasterState);

  username = signal<string>(sessionStorage.getItem('username') ?? '');
  password = signal<string>(sessionStorage.getItem('password') ?? '');



  @HostListener('window:keydown.enter')
  async loginButton() {
    const username = this.username();
    const password = this.password();

    try {
      const token = await this.state.loginToApp({username: username, password: password});

      sessionStorage.setItem('username', username);
      sessionStorage.setItem('password', password);
      sessionStorage.setItem('token', token);
    } catch {
      this.toaster.show("Boardname oder Passwort sind falsch!");
    }
  }
}
