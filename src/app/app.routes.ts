import { Routes } from '@angular/router';
import {Board} from './components/planner/board/board';
import {CreateUser} from './components/planner/create-user/create-user';
import {UserSummary} from './components/planner/user-summary/user-summary';

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
