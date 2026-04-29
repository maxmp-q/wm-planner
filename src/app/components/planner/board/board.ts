import {Component, computed, inject, signal} from '@angular/core';
import {Card} from './card/card';
import {CardDto} from '../../../interfaces/interfaces';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CardState} from '../../../store/cardState';
import {ToasterState} from '../../../store/toaster';

@Component({
  selector: 'app-board',
  imports: [
    Card,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  state = inject(CardState);
  toaster = inject(ToasterState);

  cards = computed(() => this.state.cards());
  sortedCards = computed(() => {
    if(this.cards()){
      return this.cards()
        .slice()
        .sort((a, b) => a.id - b.id);
    } else {
      return []
    }
  });

  showAdd = signal<boolean>(false);
  cardTitle = signal<string>('');

  submitForm(){
    const title = this.cardTitle();

    if(title){
      const cardID = this.sortedCards().length > 0 ? this.sortedCards()[this.sortedCards().length-1].id + 1 : 1;
      const card: CardDto = {
        title: title,
        id: cardID,
        timeSlots: []
      }

      try{
        this.state.addCard(card);
        this.toaster.show(`Card ${card.title} wurde erfolgreich hinzugefügt.`);
      } catch {
        this.toaster.show(`Fehler beim Hinzufügen der Card ${card.title}.`);
      }
    } else {
      this.toaster.show(`Fehler beim Hinzufügen der Card`);
    }
    this.showAdd.set(!this.showAdd());
  }

  addCard(){
    this.showAdd.set(!this.showAdd());
  }
}
