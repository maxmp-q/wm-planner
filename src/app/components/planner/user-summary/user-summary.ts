import {Component, computed, inject, signal} from '@angular/core';
import {CardDto, TimeSlotDto, UserDto} from '../../../interfaces/interfaces';
import {Dropdown} from '../../dropdown/dropdown';
import {UserState} from '../../../store/userState';
import {CardState} from '../../../store/cardState';

interface UserExercise{
  timeslot: TimeSlotDto;
  card: CardDto;
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
  state = inject(UserState);
  cardState = inject(CardState);

  users = computed(() => this.state.allUsers());
  cards = computed(() => this.cardState.cards());

  showDropdown = signal<boolean>(false);
  currentUser = signal<UserDto | undefined>(undefined);

  exercisesOfUser = computed(() => {
    const userExercises: UserExercise[] = [];
    const currentUser = this.currentUser();
    const cards = this.cards();

    if(currentUser){
      cards.forEach(card => {
        if(card.timeSlots){
          card.timeSlots.forEach(timeslot => {
            if(timeslot.userIDs){
              timeslot.userIDs.forEach(id => {
                if(id === currentUser.id){
                  userExercises.push({timeslot: timeslot, card: card});
                }
              })
            }
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

  selectUser(user: UserDto){
    this.currentUser.set(user);
    this.openDropdown();
  }
}
