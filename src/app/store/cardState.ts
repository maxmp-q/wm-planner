import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {CardDto, TimeSlotDto, UserDto} from '../interfaces/interfaces';
import { inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {CardRequestService} from '../services/requests/card-request.service';
import {TimeslotRequestService} from '../services/requests/timeslot-request.service';

interface State{
  cards: CardDto[];
}

const initialState: State = {
  cards: [],
}

export const CardState = signalStore(
  {providedIn: 'root'},
  withState<State>(
    initialState
  ),
  withMethods(state => {
    const cardRequest = inject(CardRequestService);

    return {
      async loadCards() {
        try{
          cardRequest.getAllCards().subscribe(result =>
            patchState(state, { cards: result })
          );
        } catch (err){
          console.error('Cards could not be loaded', err);
          patchState(state, { cards: [] });
        }
      }
    }
  }),

  // All Card functions
  withMethods(state => {
    const cardRequest =  inject(CardRequestService);

    return {
      async addCard(card: CardDto){
        try{
          const created = await firstValueFrom(cardRequest.createCard(card));
          patchState(state, {cards: [...state.cards(), created]});
        } catch (err){
          console.error('Card could not be created:', err);
          throw err;
        }
      },

      async renameCard(card: CardDto){
        try{
          const updated = await firstValueFrom(cardRequest.renameCard(card));
          const newCards = state.cards().map(card => {
            return updated.id === card.id ? updated : card;
          });
          patchState(state, {cards: newCards});
        } catch (err){
          console.error('Card could not be renamed:', err);
          throw err;
        }
      },

      async deleteCard(card: CardDto){
        try{
          await firstValueFrom(cardRequest.deleteCard(card.id));
          await state.loadCards();
        } catch (err){
          console.error('Card could not be deleted:', err);
          throw err;
        }
      }
    }
  }),

  // All Timeslot functions
  withMethods(state => {
    const timeslotRequest = inject(TimeslotRequestService);

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
        } catch (err){
          console.error("Failed to create Timeslot: ", err);
          throw err;
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
        } catch (err){
          console.error("Failed to rename Timeslot: ", err);
          throw err;
        }
      },

      async deleteTimeslot(card: CardDto, timeslot: TimeSlotDto){
        try{
          await firstValueFrom(timeslotRequest.deleteTimeslot(card.id, timeslot.id));
          await state.loadCards();
        } catch (err){
          console.error('Failed to delete timeslot:', err);
          throw err;
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
        } catch (err){
          console.error('Failed to add User to Timeslot:', err);
          throw err;
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
        } catch (err){
          console.error('Failed to remove User from Timeslot:', err);
          throw err;
        }
      }
    };
  })
)
