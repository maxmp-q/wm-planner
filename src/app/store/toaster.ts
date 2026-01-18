import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

interface ToasterState{
  message: string | undefined;
}

const initialState: ToasterState = {
  message: undefined
}

export const ToasterState = signalStore(
  {providedIn: 'root'},
  withState<ToasterState>(
    initialState
  ),
  withMethods( state => ({
    show(msg: string, duration: number = 3000) {
      patchState(state, {message: undefined}); // To clear of toaster
      patchState(state, {message: msg});
      setTimeout(()=> patchState(state, {message: undefined}), duration);
    }
  }))
)
