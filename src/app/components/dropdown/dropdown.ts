import {Component, input, output, signal} from '@angular/core';
import { IUser} from '../../interfaces/interfaces';
import {Icon} from '../icon/icon';

@Component({
  selector: 'app-dropdown',
  imports: [
    Icon
  ],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  users = input<IUser[]>();
  title = input<string>('');
  selectedCard = output<IUser>();

  showDropdown = signal<boolean>(false);

  selectEntry(user: IUser){
    this.selectedCard.emit(user);
    this.toggleDropdown();
  }

  toggleDropdown(){
    this.showDropdown.set(!this.showDropdown());
  }
}
