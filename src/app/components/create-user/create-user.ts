import {Component, computed, inject} from '@angular/core';
import {AppState} from '../../store/state';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {IUser} from '../../interfaces/interfaces';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-user',
  imports: [
    ReactiveFormsModule
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
      return []
    }
  });

  form = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
  });

  submitForm() {
    const lastID = this.sortedUsers().length > 0 ? this.sortedUsers()[this.sortedUsers().length-1].id + 1 : 1;
    const firstname = this.form.value.firstname;
    const lastname = this.form.value.lastname;

    if(firstname && lastname){
      const newUser: IUser = {
        firstname: firstname,
        lastname: lastname,
        id: lastID
      }

      if(!this.users().includes(newUser)){
        this.state.createUser(newUser);

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
