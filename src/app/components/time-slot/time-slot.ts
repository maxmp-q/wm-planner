import {Component, computed, inject, input, signal} from '@angular/core';
import {ITimeSlot, ICard, IUser} from '../../interfaces/interfaces';
import {User} from '../user/user';
import {AppState} from '../../store/state';

@Component({
  selector: 'app-time-slot',
  imports: [
    User
  ],
  templateUrl: './time-slot.html',
  styleUrl: './time-slot.scss',
})
export class TimeSlot {
  state = inject(AppState);

  timeSlot = input<ITimeSlot>();
  card = input<ICard>();
  allUsers = computed(()=> this.state.allUsers());

  availableUsers = computed(()=> {
    const currentUsers = this.timeSlot()?.users ?? [];

    return this.allUsers().filter(
      user => !currentUsers.some(cu => cu.id === user.id)
    );
  });

  showDropdown = signal(false);

  toggleDropdown() {
    this.showDropdown.set(!this.showDropdown());
  }

  addUser(user: IUser){
    const card = this.card();
    const timeslot = this.timeSlot();

    if(card && timeslot) {
      if(!this.timeSlot()?.users.includes(user)){
        this.state.addUser(
          card,
          timeslot,
          user
        );

        console.log(user.firstname + " wurde im Timeslot hinzugefügt.")
      } else {
        console.log(user.firstname + " gibt es bereits im Timeslot.")
      }
    } else {
      console.log("Es gab Probleme beim Hinzufügen von einem User.")
    }

    this.showDropdown.set(false);
  }
}
