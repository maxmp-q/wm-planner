import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {ICard, ITimeSlot, IUser} from '../interfaces/interfaces';

interface State{
  heading: string;
  cards: ICard[];
  allUsers: IUser[];
}

const testCard: ICard = {
  title: "Samstag",
  timeSlots: [
    {
      time: "Aufbau",
      users: [
        {
          firstname: "Max",
          lastname: "P.",
          id: 1
        },
        {
          firstname: "Alex",
          lastname: "P.",
          id: 2
        }
      ]
    },
    {
      time: "WBA",
      users: [
        {
          firstname: "Max",
          lastname: "P.",
          id: 1
        },
        {
          firstname: "Alex",
          lastname: "P.",
          id: 2
        }
      ]
    }
  ]
}

const initialState: State = {
  heading: 'Weihnachtsmarkt 2025',
  cards: [testCard],
  allUsers: [
    {firstname: "Max", lastname:"P.", id: 1},
    {firstname: "Alex", lastname:"P.", id: 2},
    {firstname: "Fritz", lastname:"P.", id: 3},
    {firstname: "Hell", lastname:"P.", id: 4}
  ]
}


export const AppState = signalStore(
  {providedIn: 'root'},
  withState<State>(
    initialState
  ),
  withMethods(state => ({
    createUser(user: IUser){
      patchState(state, {allUsers: [...state.allUsers(), user]});
    },
    deleteUser(user: IUser){
      const currentUsers = state.allUsers();
      const updatedUsers = currentUsers.filter(u => u.id !== user.id);

      patchState(state, {allUsers: updatedUsers});
    },
    addCard(card: ICard){
      patchState(state, {cards: [...state.cards(), card]});
    },
    addTimeslot(card: ICard, timeslot: ITimeSlot) {
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
    addUser(card: ICard, timeslot: ITimeSlot, user: IUser) {
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
    removeUser(card: ICard, timeslot: ITimeSlot, user: IUser){
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
  }))
)
