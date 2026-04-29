import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import { inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {RequestService} from '../services/requests/abstract-request.service';
import {AuthRequestService} from '../services/requests/auth-request.service';

interface State{
  heading: string;
  loggedIn: boolean;
}

const initialState: State = {
  heading: '',
  loggedIn: false
}

export const AppState = signalStore(
  {providedIn: 'root'},
  withState<State>(
    initialState
  ),
  withMethods(state => {
    const requestService = inject(RequestService);
    const authRequest = inject(AuthRequestService);

    return {
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
  })
)
