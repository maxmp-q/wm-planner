import {Component, computed, inject, signal} from '@angular/core';
import {AppState} from '../../store/state';
import {ICard, ITimeSlot, IUser} from '../../interfaces/interfaces';
import {Dropdown} from '../dropdown/dropdown';

interface UserExercise{
  timeslot: ITimeSlot;
  card: ICard;
}

@Component({
  selector: 'app-user-summary',
  imports: [
    Dropdown
  ],
  templateUrl: './user-summary.html',
  styleUrl: './user-summary.scss',
})
export class UserSummary {
  state = inject(AppState);

  users = computed(() => this.state.allUsers());
  cards = computed(() => this.state.cards());

  showDropdown = signal<boolean>(false);
  currentUser = signal<IUser | undefined>(undefined);

  exercisesOfUser = computed(() => {
    const userExercises: UserExercise[] = [];
    const currentUser = this.currentUser();
    const cards = this.cards();

    if(currentUser){
      cards.forEach(card => {
        if(card.timeSlots){
          card.timeSlots.forEach(timeslots => {
            timeslots.userIDs.forEach(id => {
              if(id === currentUser.id){
                userExercises.push({timeslot: timeslots, card: card});
              }
            })
          })
        }
      })
    }

    userExercises.sort((a,b) => a.timeslot.id - b.timeslot.id);

    return userExercises;
  })

  openDropdown(){
    this.showDropdown.set(!this.showDropdown());
  }

  selectUser(user: IUser){
    this.currentUser.set(user);
    this.openDropdown();
  }
}
