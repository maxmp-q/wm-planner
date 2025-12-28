import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {ICard, ITimeSlot, IUser} from '../interfaces/interfaces';
import { inject} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';

interface State{
  heading: string;
  cards: ICard[];
  allUsers: IUser[];
}

const initialState: State = {
  heading: 'Weihnachtsmarkt 2025',
  cards: [],
  allUsers: []
}

export const AppState = signalStore(
  {providedIn: 'root'},
  withState<State>(
    initialState
  ),
  withMethods(state => {
    const firestore = inject(FirebaseService)

    return {
      async loadUsers(){
        const users = await firestore.getAllUsers();
        patchState(state, {allUsers: users});
      },

      async loadCards(){
        const cards = await firestore.getAllCards();
        patchState(state, {cards: cards});
      },

      async createUser(user: IUser){
        await firestore.createUser(user);
        await this.loadUsers();
      },

      async deleteUser(user: IUser){
        await firestore.deleteUser(user);
        await this.loadUsers();
      },

      async addCard(card: ICard){
        await firestore.addCard(card);
        await this.loadCards();
      },

      async renameCard(card: ICard){
        await firestore.renameCard(card);
        await this.loadCards();
      },

      async deleteCard(card: ICard){
        await firestore.deleteCard(card);
        await this.loadCards();
      },

      async addTimeslot(card: ICard, timeslot: ITimeSlot) {
        await firestore.addTimeslot(card, timeslot);
        await this.loadCards();
      },

      async renameTimeslot(card: ICard, timeslot: ITimeSlot){
        await firestore.renameTimeslot(card, timeslot);
        await this.loadCards();
      },

      async addUser(card: ICard, timeslot: ITimeSlot, user: IUser) {
        await firestore.addUser(card, timeslot, user);
        await this.loadCards();
      },

      async removeUser(card: ICard, timeslot: ITimeSlot, user: IUser){
        await firestore.removeUser(card, timeslot, user);
        await this.loadCards();
      }
    };
  })
)
