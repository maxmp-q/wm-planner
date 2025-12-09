import { Routes } from '@angular/router';
import {Board} from './components/board/board';
import {CreateUser} from './components/create-user/create-user';
import {UserSummary} from './components/user-summary/user-summary';

export const routes: Routes = [
  {
    path: '',
    component: Board
  },
  {
    path: 'create-user',
    component: CreateUser
  },
  {
    path: 'user-summary',
    component: UserSummary
  }
];
