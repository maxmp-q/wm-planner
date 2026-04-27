import {Component, inject, input, signal} from '@angular/core';
import {CardDto, TimeSlotDto, UserDto} from '../../../../interfaces/interfaces';
import {AppState} from '../../../../store/state';
import {Icon} from '../../../icon/icon';

@Component({
  selector: 'app-user',
  imports: [
    Icon
  ],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {
  state = inject(AppState);

  user = input<UserDto>();
  timeslot = input<TimeSlotDto>();
  card = input<CardDto>();

  details = signal<boolean>(false);

  showDetails(){
    this.details.set(!this.details());
  }

  removeUser(){
    const user = this.user();
    const timeslot = this.timeslot();
    const card = this.card();

    if(card && timeslot && user){
      this.state.removeUser(card, timeslot, user);

      console.log(user.firstname + " wurde vom Timeslot entfernt.")
    } else {
      console.log("Es gab Probleme beim Löschen des Users.")
    }

  }
}
