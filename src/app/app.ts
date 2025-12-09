import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/header/header';
import {Board} from './components/board/board';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Board],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
