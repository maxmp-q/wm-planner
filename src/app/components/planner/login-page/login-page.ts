import {Component, HostListener, inject, signal, ChangeDetectionStrategy} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppState} from '../../../store/state';
import {ToasterState} from '../../../store/toaster';
import {Spinner} from '../../spinner/spinner';


@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    Spinner
  ],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login-page.scss',
})
export class LoginPage {
  state = inject(AppState);
  toaster = inject(ToasterState);

  username = signal<string>(sessionStorage.getItem('username') ?? '');
  password = signal<string>(sessionStorage.getItem('password') ?? '');

  loading = signal<boolean>(false);


  @HostListener('window:keydown.enter')
  async loginButton() {
    const username = this.username();
    const password = this.password();

    this.loading.set(true);

    try {
      const token = await this.state.loginToApp({username: username, password: password});

      sessionStorage.setItem('username', username);
      sessionStorage.setItem('password', password);
      sessionStorage.setItem('token', token);
    } catch {
      this.toaster.show("Boardname oder Passwort sind falsch!");
    } finally {
      this.loading.set(false);
    }
  }
}
