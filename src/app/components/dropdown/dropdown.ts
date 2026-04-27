import {Component, input, output, signal} from '@angular/core';
import { UserDto} from '../../interfaces/interfaces';
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
  users = input<UserDto[]>();
  title = input<string>('');
  selectedCard = output<UserDto>();

  showDropdown = signal<boolean>(false);

  selectEntry(user: UserDto){
    this.selectedCard.emit(user);
    this.toggleDropdown();
  }

  toggleDropdown(){
    this.showDropdown.set(!this.showDropdown());
  }
}
