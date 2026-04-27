import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {CardDto, TimeSlotDto, UserDto} from '../interfaces/interfaces';
import { inject} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {PasswortService} from '../services/passwort.service';
import {UserRequestService} from '../services/requests/user-request.service';
import {firstValueFrom} from 'rxjs';
import {ToasterState} from './toaster';

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
    const request = inject(UserRequestService);

    return {
      async loadUsers() {
        try {
          request.getAllUsers().subscribe(result =>
            patchState(state, { allUsers: result })
          );
        } catch (err) {
          console.error('Users could not be loaded', err);
          patchState(state, { allUsers: [] });
        }
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
    const userRequest = inject(UserRequestService);
    const toaster = inject(ToasterState);


    return {
      async createUser(user: UserDto){
        try {
          const created = await firstValueFrom(userRequest.createUser(user));
          patchState(state, {allUsers: [...state.allUsers(), created]});
          toaster.show(`User ${user.firstname} ${user.lastname} erfolgreich erstellt.`);
        } catch (err){
          console.error('User could not be created.', err);
          toaster.show(`Es gab einen Fehler beim Erstellen des User ${user.firstname} ${user.lastname}`);
        }
      },

      async deleteUser(user: UserDto){
        try{
          await firstValueFrom(userRequest.deleteUser(user.id));

          await state.loadUsers();
          await state.loadCards();

          toaster.show(`User ${user.firstname} ${user.lastname} erfolgreich gelöscht.`)
        } catch (err){
          toaster.show(`Fehler beim Löschen des User ${user.firstname} ${user.lastname}.`)
          console.error('User could not be deleted:', err);
        }
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
