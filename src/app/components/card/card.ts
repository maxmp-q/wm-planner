import {Component, computed, inject, input, signal} from '@angular/core';
import {ICard, ITimeSlot} from '../../interfaces/interfaces';
import {TimeSlot} from '../time-slot/time-slot';
import {AppState} from '../../store/state';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
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

  expanded = signal<boolean>(false);

  sortedTimeslots = computed(() => {
    const timeslots = this.timeslots();
    if(timeslots){
      return timeslots
        .slice()
        .sort((a, b) => a.id - b.id);
    } else {
      return []
    }
  });

  showAdd = signal<boolean>(false);

  form = new FormGroup({
    time: new FormControl(''),
  });

  submitForm(){
    const card = this.card();
    const time = this.form.value.time;

    if(time && card){
      const timeslotID = this.sortedTimeslots().length > 0 ? this.sortedTimeslots()[this.sortedTimeslots().length-1].id + 1 : 1;

      const timeslot: ITimeSlot = {
        time: time,
        id: timeslotID,
        users: []
      }

      this.state.addTimeslot(card, timeslot)

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
