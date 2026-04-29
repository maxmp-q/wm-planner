import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {UserDto} from '../interfaces/interfaces';
import {inject} from '@angular/core';
import {UserRequestService} from '../services/requests/user-request.service';
import {firstValueFrom} from 'rxjs';
import {CardState} from './cardState';

interface State{
  allUsers: UserDto[];
}

const initialState: State = {
  allUsers: [],
}

export const UserState = signalStore(
  {providedIn: 'root'},
  withState<State>(
    initialState
  ),
  withMethods(state => {
    const userRequest = inject(UserRequestService);

    return {
      async loadUsers() {
        try {
          const users = await firstValueFrom(userRequest.getAllUsers());
          patchState(state, {allUsers: users});
        } catch (err) {
          console.error('Users could not be loaded', err);
          patchState(state, { allUsers: [] });
        }
      }
    }
  }),

  //All User functions
  withMethods(userState => {
    const userRequest =  inject(UserRequestService);
    const cardState = inject(CardState);

    return {
      async createUser(user: UserDto){
        try {
          const created = await firstValueFrom(userRequest.createUser(user));
          patchState(userState, {allUsers: [...userState.allUsers(), created]});
          return created;
        } catch (err){
          console.error('User could not be created.', err);
          await userState.loadUsers();
          throw err;
        }
      },

      async deleteUser(user: UserDto){
        try{
          await firstValueFrom(userRequest.deleteUser(user.id));

          await userState.loadUsers();
          await cardState.loadCards();
        } catch (err){
          console.error('User could not be deleted:', err);
          await userState.loadUsers();
          throw err;
        }
      }
    }
  }),
)
