import {Component, computed, inject, signal} from '@angular/core';
import {AppState} from '../../store/state';
import {Card} from '../card/card';
import {ICard} from '../../interfaces/interfaces';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

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
  state = inject(AppState);

  cards = computed(() => this.state.cards());
  sortedCards = computed(() => {
    if(this.cards()){
      return this.cards()
        .slice()
        .sort((a, b) => a.id - b.id);
    } else {
      return []
    }
  })
  showAdd = signal<boolean>(false);

  form = new FormGroup({
    title: new FormControl(''),
  });

  submitForm(){
    const title = this.form.value.title;

    if(title){
      const cardID = this.sortedCards().length > 0 ? this.sortedCards()[this.sortedCards().length-1].id + 1 : 1;
      const card: ICard = {
        title: title,
        id: cardID,
        timeSlots: []
      }

      this.state.addCard(card)

      console.log(card.title + " wurde erflogreich erstellt.")
    } else {
      console.log("Es gab Probleme beim Erstellen der Karte")
    }
    this.showAdd.set(!this.showAdd());
  }

  addCard(){
    this.showAdd.set(!this.showAdd());
  }
}
