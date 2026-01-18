import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {ICard, ITimeSlot, IUser} from '../interfaces/interfaces';
import { inject} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {PasswortService} from '../services/passwort.service';

interface State{
  heading: string;
  cards: ICard[];
  allUsers: IUser[];
  loggedIn: boolean;
}

const initialState: State = {
  heading: '',
  cards: [],
  allUsers: [],
  loggedIn: false
}

export const AppState = signalStore(
  {providedIn: 'root'},
  withState<State>(
    initialState
  ),
  withMethods(state => {
    const firestore = inject(FirebaseService);
    const passwort = inject(PasswortService);

    return {
      async loadUsers() {
        const users = await firestore.getAllUsers();
        patchState(state, {allUsers: users});
      },

      async loadCards() {
        const cards = await firestore.getAllCards();
        patchState(state, {cards: cards});
      },

      async loadHeading() {
        const heading = await firestore.getHeading();
        patchState(state, {heading: heading});
      },

      async loginToApp(value: string) {
        const login = await firestore.getPasswortHash() === await passwort.hashSHA256(value);
        patchState(state, {loggedIn: login});
      },
    }
  }),
  withMethods(state => {
    const firestore = inject(FirebaseService);

    return {
      async createUser(user: IUser){
        await firestore.createUser(user);
        await state.loadUsers();
      },

      async deleteUser(user: IUser){
        await firestore.deleteUser(user);
        await state.loadUsers();
        await state.loadCards();
      },

      async addCard(card: ICard){
        await firestore.addCard(card);
        await state.loadCards();
      },

      async renameCard(card: ICard){
        await firestore.renameCard(card);
        await state.loadCards();
      },

      async deleteCard(card: ICard){
        await firestore.deleteCard(card);
        await state.loadCards();
      },

      async addTimeslot(card: ICard, timeslot: ITimeSlot) {
        await firestore.addTimeslot(card, timeslot);
        await state.loadCards();
      },

      async renameTimeslot(card: ICard, timeslot: ITimeSlot){
        await firestore.renameTimeslot(card, timeslot);
        await state.loadCards();
      },

      async deleteTimeslot(card: ICard, timeslot: ITimeSlot){
        await firestore.deleteTimeslot(card, timeslot);
        await state.loadCards();
      },

      async addUser(card: ICard, timeslot: ITimeSlot, user: IUser) {
        await firestore.addUser(card, timeslot, user);
        await state.loadCards();
      },

      async removeUser(card: ICard, timeslot: ITimeSlot, user: IUser){
        await firestore.removeUser(card, timeslot, user);
        await state.loadCards();
      }
    };
  })
)
