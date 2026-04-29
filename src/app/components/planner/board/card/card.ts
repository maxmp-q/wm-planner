import {Component, computed, inject, input, signal} from '@angular/core';
import {CardDto, TimeSlotDto} from '../../../../interfaces/interfaces';
import {TimeSlot} from '../time-slot/time-slot';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Icon} from '../../../icon/icon';
import {CardState} from '../../../../store/cardState';
import {ToasterState} from '../../../../store/toaster';

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
  state = inject(CardState);
  toaster = inject(ToasterState);

  card = input<CardDto>();
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
      this.newCardName.set(card.title);
    } else if(card && card.title !== this.newCardName()) {
      try {
        this.state.renameCard({...card, title: this.newCardName()});
        this.toaster.show(`Card ${card.title} in ${this.newCardName()} umbenannt.`);
      } catch {
        this.toaster.show(`Fehler beim Umbennen der Card ${card.title}.`);
      }
    }
    this.editMode.set(!this.editMode());
  }

  deleteCard(){
    const card = this.card();

    if(card){
      try {
        this.state.deleteCard(card);
        this.toaster.show(`Card ${card.title} erfolgreich gelöscht.`);
      } catch {
        this.toaster.show(`Fehler beim Löschen der Card ${card.title}`);
      }
    }
  }

  submitForm(){
    const card = this.card();
    const time = this.time();

    if(time && card){
      const timeslotID = this.sortedTimeslots().length > 0
        ? this.sortedTimeslots()[this.sortedTimeslots().length-1].id + 1
        : 1;

      const timeslot: TimeSlotDto = {
        time: time,
        id: timeslotID,
        userIDs: []
      };

      try {
        this.state.addTimeslot(card, timeslot);
        this.toaster.show(`Timeslot ${timeslot.time} erfolgreich erstellt.`);
      } catch {
        this.toaster.show('Fehler beim Erstellen des Timeslots.');
      }

      this.time.set('');
    }
    this.showAdd.set(!this.showAdd());
  }

  toggleAdd(){
    this.showAdd.set(!this.showAdd())
  }

  toggleExpanded(){
    this.expanded.set(!this.expanded());
  }
}
