import {Component, computed, inject, input, signal} from '@angular/core';
import {TimeSlotDto, CardDto, UserDto} from '../../../../interfaces/interfaces';
import {User} from '../user/user';
import {Dropdown} from '../../../dropdown/dropdown';
import {FormsModule} from '@angular/forms';
import {Icon} from '../../../icon/icon';
import {CardState} from '../../../../store/cardState';
import {UserState} from '../../../../store/userState';
import {ToasterState} from '../../../../store/toaster';

@Component({
  selector: 'app-time-slot',
  imports: [
    User,
    Dropdown,
    FormsModule,
    Icon
  ],
  templateUrl: './time-slot.html',
  styleUrl: './time-slot.scss',
})
export class TimeSlot {
  state = inject(CardState);
  userState = inject(UserState);
  toaster = inject(ToasterState);

  timeSlot = input<TimeSlotDto>();
  card = input<CardDto>();
  allUsers = computed(()=> this.userState.allUsers());

  availableUsers = computed(()=> {
    const currentUsers = this.currentUsers();

    return this.allUsers().filter(
      user => !currentUsers.some(cu => cu.id === user.id)
    );
  });

  currentUsers = computed(() => {
    const timeslot = this.timeSlot();
    const allUsers = this.allUsers();

    const timeslotUsers: UserDto[] = [];

    if(timeslot && allUsers && timeslot.userIDs?.length > 0){
      timeslot.userIDs.forEach(id => {
        allUsers.forEach(user => {
          if(user.id === id){
            timeslotUsers.push(user);
          }
        })
      })
    }

    return timeslotUsers;
  });

  showDropdown = signal<boolean>(false);
  editMode = signal<boolean>(false);
  newTimeslotTime = signal<string>('');

  toggleDropdown() {
    this.showDropdown.set(!this.showDropdown());
  }

  openMenu(){
    const card = this.card()
    const timeslot = this.timeSlot();

    if(!this.editMode() && timeslot){
      this.newTimeslotTime.set(timeslot.time);
    } else if(timeslot && card && timeslot.time !== this.newTimeslotTime()) {
      try {
        this.state.renameTimeslot(card, {...timeslot, time: this.newTimeslotTime()});
        this.toaster.show(`Timeslot ${timeslot.time} in ${this.newTimeslotTime()} umbenannt.`);
      } catch {
        this.toaster.show('Fehler beim Umbennen des Timeslots.');
      }
    }
    this.editMode.set(!this.editMode());
  }

  addUser(user: UserDto){
    const card = this.card();
    const timeslot = this.timeSlot();

    if(card && timeslot) {
      if(!timeslot.userIDs?.includes(user.id) || !timeslot.userIDs){
        try {
          this.state.addUser(card, timeslot, user);
          this.toaster.show(`User ${user.firstname} erfolgreich hinzugefügt.`);
        } catch {
          this.toaster.show('Fehler beim Hinzufügen des Users.');
        }
      } else {
        this.toaster.show(`${user.firstname} gibt es bereits im Timeslot.`);
      }
    } else {
      this.toaster.show('Fehler beim Hinzufügen des Users.');
    }

    this.showDropdown.set(false);
  }

  deleteTimeslot(){
    const card = this.card();
    const timeslot = this.timeSlot();

    if(card && timeslot){
      try {
        this.state.deleteTimeslot(card, timeslot);
        this.toaster.show(`Timeslot ${timeslot.time} erfolgreich gelöscht.`);
      } catch {
        this.toaster.show('Fehler beim Löschen des Timeslots.');
      }
    }
  }
}
