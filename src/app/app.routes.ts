import { Routes } from '@angular/router';
import {Board} from './components/board/board';
import {CreateUser} from './components/create-user/create-user';

export const routes: Routes = [
  {
    path: '',
    component: Board
  },
  {
    path: 'create-user',
    component: CreateUser
  }
];
