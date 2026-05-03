import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {RequestService} from '../services/requests/abstract-request.service';
import {AuthRequestService} from '../services/requests/auth-request.service';
import {LoginDto} from '../interfaces/interfaces';

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

      async loginToApp(value: LoginDto): Promise<string> {
        try{
          const login = await firstValueFrom(authRequest.login(value));
          patchState(state, {loggedIn: !!login});
          return login.token;
        } catch (err){
          console.log("Error occurred while logging into app: ", err);
          throw err;
        }
      },
    }
  })
)
