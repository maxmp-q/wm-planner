import {Component, computed, inject, signal} from '@angular/core';
import {AppState} from '../../store/state';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IUser} from '../../interfaces/interfaces';
import {Router} from '@angular/router';
import {Icon} from '../icon/icon';

@Component({
  selector: 'app-create-user',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    Icon
  ],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss',
})
export class CreateUser {
  state = inject(AppState);
  router = inject(Router);

  users = computed(()=> this.state.allUsers());
  sortedUsers = computed(() => {
    if(this.users()){
      return this.users()
        .slice()
        .sort((a, b) => a.id - b.id);
    } else {
      return [];
    }
  });

  firstname = signal<string>('');
  lastname = signal<string>('')

  submitForm() {
    const lastID = this.sortedUsers().length > 0 ? this.sortedUsers()[this.sortedUsers().length-1].id + 1 : 1;
    const firstname = this.firstname();
    const lastname = this.lastname();

    if(firstname && lastname){
      const newUser: IUser = {
        firstname: firstname,
        lastname: lastname,
        id: lastID
      }

      if(!this.users().includes(newUser)){
        this.state.createUser(newUser);

        this.firstname.set('');
        this.lastname.set('');

        console.log(newUser.firstname + " wurde erstellt!");
      } else {
        console.log("User existiert schon oder es gab Probleme beim erstellen.");
      }
    } else {
      console.log("Vor- oder Nachname wurde nicht eingetragen!");
    }
  }

  deleteUser(user: IUser){
    this.state.deleteUser(user);
  }

  goToUserSummary(){
    this.router.navigate(['/user-summary']);
  }
}
