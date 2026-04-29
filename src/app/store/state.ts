import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {CardDto, TimeSlotDto, UserDto} from '../interfaces/interfaces';
import { inject} from '@angular/core';
import {UserRequestService} from '../services/requests/user-request.service';
import {firstValueFrom} from 'rxjs';
import {ToasterState} from './toaster';
import {CardRequestService} from '../services/requests/card-request.service';
import {TimeslotRequestService} from '../services/requests/timeslot-request.service';
import {RequestService} from '../services/requests/abstract-request.service';
import {AuthRequestService} from '../services/requests/auth-request.service';

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
    const requestService = inject(RequestService);
    const userRequest = inject(UserRequestService);
    const cardRequest = inject(CardRequestService);
    const authRequest = inject(AuthRequestService);

    return {
      async loadUsers() {
        try {
          userRequest.getAllUsers().subscribe(result =>
            patchState(state, { allUsers: result })
          );
        } catch (err) {
          console.error('Users could not be loaded', err);
          patchState(state, { allUsers: [] });
        }
      },

      async loadCards() {
        try{
          cardRequest.getAllCards().subscribe(result =>
            patchState(state, { cards: result })
          );
        } catch (err){
          console.error('Cards could not be loaded', err);
          patchState(state, { cards: [] });
        }
      },

      async loadHeading() {
        try{
          const heading = await firstValueFrom(requestService.getHeading());
          patchState(state, {heading: heading.title});
        } catch (err) {
          console.error("Failed to load heading: ", err);
        }
      },

      async loginToApp(value: string) {
        try{
          const login = await firstValueFrom(authRequest.login(value));
          patchState(state, {loggedIn: login});
        } catch (err){
          console.log("Password was wrong: ", err);
        }
      },
    }
  }),

  //All User functions
  withMethods(state => {
    const userRequest =  inject(UserRequestService);
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
      }
    }
  }),

  // All Card functions
  withMethods(state => {
    const cardRequest =  inject(CardRequestService);
    const toaster = inject(ToasterState);

    return {
      async addCard(card: CardDto){
        try{
          const created = await firstValueFrom(cardRequest.createCard(card));
          patchState(state, {cards: [...state.cards(), created]});
          toaster.show(`Card ${card.title} wurde erfolgreich hinzugefügt.`);
        } catch (err){
          toaster.show(`Fehler beim Hinzufügen der Card ${card.title}.`)
          console.error('Card could not be created:', err);
        }
      },

      async renameCard(card: CardDto){
        try{
          const updated = await firstValueFrom(cardRequest.renameCard(card));
          const newCards = state.cards().map(card => {
            return updated.id === card.id ? updated : card;
          });
          patchState(state, {cards: newCards});
          toaster.show(`Card ${card.title} wurde erfolgreich umbenannt.`);
        } catch (err){
          toaster.show(`Fehler beim Umbennen der Card ${card.title}.`)
          console.error('Card could not be renamed:', err);
        }
      },

      async deleteCard(card: CardDto){
        try{
          await firstValueFrom(cardRequest.deleteCard(card.id));

          state.loadCards();
          toaster.show(`Card ${card.title} erfolgreich gelöscht.`);
        } catch (err){
          toaster.show(`Fehler beim Löschen der Card ${card.title}`);
          console.error('Card could not be deleted:', err);
        }
      }
    }
  }),

  // All Timeslot functions
  withMethods(state => {
    const timeslotRequest = inject(TimeslotRequestService);
    const toaster = inject(ToasterState);


    return {
      async addTimeslot(card: CardDto, timeslot: TimeSlotDto) {
        try{
          const created = await firstValueFrom(timeslotRequest.createTimeslot(card, timeslot));
          const newCards = state.cards().map(old => {
            if(old.id === card.id){
              return {
                ...old,
                timeSlots: [...old.timeSlots, created]
              };
            } else {
              return old;
            }
          });

          patchState(state, {cards: newCards});
          toaster.show(`Timeslot ${timeslot.time} erfolgreich erstellt.`);
        } catch (err){
          console.error("Failed to create Timeslot: ", err);
          toaster.show('Fehler beim Erstellen des Timeslots.');
        }
      },

      async renameTimeslot(card: CardDto, timeslot: TimeSlotDto){
        try{
          const renamed = await firstValueFrom(timeslotRequest.renameTimeslot(card, timeslot));
          const newCards = state.cards().map(old => {
            if(old.id === card.id){
              const newTimeSlots = old.timeSlots.map(oldTime =>
                oldTime.id === renamed.id ? renamed : oldTime
              );
              return {...old, timeSlots: newTimeSlots};
            } else {
              return old;
            }
          });

          patchState(state, {cards: newCards});
          toaster.show(`Timeslot ${timeslot.time} erfolgreich umbenannt.`);
        } catch (err){
          console.error("Failed to rename Timeslot: ", err);
          toaster.show('Fehler beim Umbennen des Timeslots.');
        }
      },

      async deleteTimeslot(card: CardDto, timeslot: TimeSlotDto){
        try{
          await firstValueFrom(timeslotRequest.deleteTimeslot(card.id, timeslot.id));
          state.loadCards();
          toaster.show(`Timeslot ${timeslot.time} erfolgreich gelöscht.`);
        } catch (err){
          toaster.show('Fehler beim Löschen des Timeslots.');
          console.error('Failed to delete timeslot:', err);
        }
      },

      async addUser(card: CardDto, timeslot: TimeSlotDto, user: UserDto) {
        try{
          const added = await firstValueFrom(timeslotRequest.addUser(card.id, timeslot.id, user.id));
          const newCards = state.cards().map(c => {
            if(c.id === card.id){
              const newTimeSlots = c.timeSlots.map(ts =>
                ts.id === added.id ? added : ts
              );
              return {...c, timeSlots: newTimeSlots};
            } else {
              return c;
            }
          });

          patchState(state, {cards: newCards});
          toaster.show(`User ${user.firstname} erfolgreich hinzugefügt.`);
        } catch (err){
          toaster.show('Fehler beim Hinzufügen des Users.');
          console.error('Failed to add User to Timeslot:', err);
        }
      },

      async removeUser(card: CardDto, timeslot: TimeSlotDto, user: UserDto){
        try{
          const removed = await firstValueFrom(timeslotRequest.removeUser(card.id, timeslot.id, user.id));
          const newCards = state.cards().map(c => {
            if(c.id === card.id){
              const newTimeSlots = c.timeSlots.map(ts =>
                ts.id === removed.id ? removed : ts
              );
              return {...c, timeSlots: newTimeSlots};
            } else {
              return c;
            }
          });

          patchState(state, {cards: newCards});
          toaster.show(`User ${user.firstname} erfolgreich entfernt.`);
        } catch (err){
          toaster.show('Fehler beim Entfernen des Users.');
          console.error('Failed to remove User from Timeslot:', err);
        }
      }
    };
  })
)
