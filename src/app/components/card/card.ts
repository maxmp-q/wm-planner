import {Component, computed, inject, input, signal} from '@angular/core';
import {ICard, ITimeSlot} from '../../interfaces/interfaces';
import {TimeSlot} from '../time-slot/time-slot';
import {AppState} from '../../store/state';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Icon} from '../icon/icon';

@Component({
  selector: 'app-card',
  imports: [
    TimeSlot,
    FormsModule,
    ReactiveFormsModule,
    Icon
  ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  state = inject(AppState);

  card = input<ICard>();
  timeslots = computed(() => this.card()?.timeSlots);

  editMode = signal<boolean>(false);
  expanded = signal<boolean>(false);
  showAdd = signal<boolean>(false);
  time = signal<string>('');
  newCardName = signal<string>('');

  sortedTimeslots = computed(() => {
    const timeslots = this.timeslots();
    if(timeslots){
      return timeslots
        .slice()
        .sort((a, b) => a.id - b.id);
    } else {
      return [];
    }
  });

  openMenu(){
    const card = this.card();
    if(!this.editMode() && card){
      this.newCardName.set(card.title)
    } else if(card) {
      this.state.renameCard({...card, title: this.newCardName()})
    }
    this.editMode.set(!this.editMode());
  }

  submitForm(){
    const card = this.card();
    const time = this.time();

    if(time && card){
      const timeslotID = this.sortedTimeslots().length > 0
        ? this.sortedTimeslots()[this.sortedTimeslots().length-1].id + 1
        : 1;

      const timeslot: ITimeSlot = {
        time: time,
        id: timeslotID,
        users: []
      };

      this.state.addTimeslot(card, timeslot);

      this.time.set('');

      console.log(timeslot.time + " wurde erflogreich erstellt.")
    } else {
      console.log("Es gab Probleme beim Erstellen des Timeslots")
    }
    this.showAdd.set(!this.showAdd());
  }

  addTimeslot(){
    this.showAdd.set(!this.showAdd())
  }

  toggleExpanded(){
    this.expanded.set(!this.expanded());
  }
}
