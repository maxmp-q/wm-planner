import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserDto} from '../../../interfaces/interfaces';
import {Router} from '@angular/router';
import {Icon} from '../../icon/icon';
import {UserState} from '../../../store/userState';
import {ToasterState} from '../../../store/toaster';

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
  state = inject(UserState);
  toaster = inject(ToasterState);
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
      const newUser: UserDto = {
        firstname: firstname,
        lastname: lastname,
        id: lastID
      }

      if(!this.users().includes(newUser)){
        try{
          this.state.createUser(newUser);
          this.toaster.show(`User ${newUser.firstname} ${newUser.lastname} erfolgreich erstellt.`);

          this.firstname.set('');
          this.lastname.set('');
        } catch {
          this.toaster.show(`Fehler beim Erstellen des User ${newUser.firstname} ${newUser.lastname}`);
        }
      } else {
        console.error("User existiert schon oder es gab Probleme beim erstellen.");
      }
    } else {
      this.toaster.show("Vor- oder Nachname wurde nicht eingetragen!");
    }
  }

  deleteUser(user: UserDto){
    try {
      this.state.deleteUser(user);
      this.toaster.show(`User ${user.firstname} ${user.lastname} erfolgreich gelöscht.`);
    } catch {
      this.toaster.show(`Fehler beim Löschen des User ${user.firstname} ${user.lastname}.`)
    }
  }

  goToUserSummary(){
    this.router.navigate(['/user-summary']);
  }
}
