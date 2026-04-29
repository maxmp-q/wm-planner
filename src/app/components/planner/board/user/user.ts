import {Component, inject, input, signal} from '@angular/core';
import {CardDto, TimeSlotDto, UserDto} from '../../../../interfaces/interfaces';
import {Icon} from '../../../icon/icon';
import {CardState} from '../../../../store/cardState';
import {ToasterState} from '../../../../store/toaster';

@Component({
  selector: 'app-user',
  imports: [
    Icon
  ],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {
  state = inject(CardState);
  toaster = inject(ToasterState);

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
      try {
        this.state.removeUser(card, timeslot, user);
        this.toaster.show(`User ${user.firstname} erfolgreich entfernt.`);
      } catch {
        this.toaster.show('Fehler beim Entfernen des Users.');
      }
    } else {
      this.toaster.show('Fehler beim Entfernen des Users.');
    }
  }
}
