import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {CardDto, TimeSlotDto, UserDto} from '../interfaces/interfaces';
import { inject} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {PasswortService} from '../services/passwort.service';

interface State{
  heading: string;
  cards: CardDto[];
  allUsers: UserDto[];
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
      async createUser(user: UserDto){
        await firestore.createUser(user);
        await state.loadUsers();
      },

      async deleteUser(user: UserDto){
        await firestore.deleteUser(user);
        await state.loadUsers();
        await state.loadCards();
      },

      async addCard(card: CardDto){
        await firestore.addCard(card);
        await state.loadCards();
      },

      async renameCard(card: CardDto){
        await firestore.renameCard(card);
        await state.loadCards();
      },

      async deleteCard(card: CardDto){
        await firestore.deleteCard(card);
        await state.loadCards();
      },

      async addTimeslot(card: CardDto, timeslot: TimeSlotDto) {
        await firestore.addTimeslot(card, timeslot);
        await state.loadCards();
      },

      async renameTimeslot(card: CardDto, timeslot: TimeSlotDto){
        await firestore.renameTimeslot(card, timeslot);
        await state.loadCards();
      },

      async deleteTimeslot(card: CardDto, timeslot: TimeSlotDto){
        await firestore.deleteTimeslot(card, timeslot);
        await state.loadCards();
      },

      async addUser(card: CardDto, timeslot: TimeSlotDto, user: UserDto) {
        await firestore.addUser(card, timeslot, user);
        await state.loadCards();
      },

      async removeUser(card: CardDto, timeslot: TimeSlotDto, user: UserDto){
        await firestore.removeUser(card, timeslot, user);
        await state.loadCards();
      }
    };
  })
)
