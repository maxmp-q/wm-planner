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
        patchState(state, {allUsers: [...state.allUsers(), user]});
      },

      async deleteUser(user: IUser){
        await firestore.deleteUser(user);

        const updatedUsers = state.allUsers().filter(u => u.id !== user.id);
        patchState(state, {allUsers: updatedUsers});
      },

      async addCard(card: ICard){
        await firestore.addCard(card);

        patchState(state, {cards: [...state.cards(), card]});
      },

      async addTimeslot(card: ICard, timeslot: ITimeSlot) {
        await firestore.addTimeslot(card, timeslot);

        const updatedCards = state.cards().map(c => {
          if (c === card) {
            return {
              ...c,
              timeSlots: [...c.timeSlots, timeslot]
            };
          }
          return c;
        });
        patchState(state, { cards: updatedCards });
      },

      async addUser(card: ICard, timeslot: ITimeSlot, user: IUser) {
        await firestore.addUser(card, timeslot, user);

        const updatedCards = state.cards().map(c => {
          if (c === card) {
            return {
              ...c,
              timeSlots: c.timeSlots.map(ts => {
                if (ts === timeslot) {
                  return {
                    ...ts,
                    users: [...ts.users, user]
                  };
                }
                return ts;
              })
            };
          }
          return c;
        });
        patchState(state, { cards: updatedCards });
      },

      async removeUser(card: ICard, timeslot: ITimeSlot, user: IUser){
        await firestore.removeUser(card, timeslot, user);

        const updatedCards = state.cards().map(c => {
          if (c === card) {
            return {
              ...c,
              timeSlots: c.timeSlots.map(ts => {
                if (ts === timeslot) {
                  return {
                    ...ts,
                    users: ts.users.filter(u => u.id !== user.id)
                  };
                }
                return ts;
              })
            };
          }
          return c;
        });

        patchState(state, { cards: updatedCards });
      }
    };
  })
)
