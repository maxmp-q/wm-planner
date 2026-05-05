import {ComponentFixture, TestBed} from '@angular/core/testing';
import { CreateUser } from './create-user';
import { UserState } from '../../../store/userState';
import { ToasterState } from '../../../store/toaster';
import { Router } from '@angular/router';

describe('CreateUser', () => {
  let component: CreateUser;
  let fixture: ComponentFixture<CreateUser>;

  let mockUserState = {
    allUsers: jest.fn(),
    createUser: jest.fn(),
  };

  const mockToaster = {
    show: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserState.allUsers.mockReturnValue([]);

    TestBed.configureTestingModule({
      providers: [
        CreateUser,
        { provide: UserState, useValue: mockUserState },
        { provide: ToasterState, useValue: mockToaster },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture = TestBed.createComponent(CreateUser);
    component = fixture.componentInstance;
  });

  it('should create a new user and show success message', () => {
    component.firstname.set('Max');
    component.lastname.set('Mustermann');

    mockUserState.createUser.mockResolvedValue({
      id: 1,
      firstname: 'Max',
      lastname: 'Mustermann',
    });

    component.submitForm();

    expect(mockUserState.createUser).toHaveBeenCalledWith({
      id: 1,
      firstname: 'Max',
      lastname: 'Mustermann',
    });

    expect(mockToaster.show).toHaveBeenCalledWith(
      'User Max Mustermann erfolgreich erstellt.'
    );

    expect(component.firstname()).toBe('');
    expect(component.lastname()).toBe('');
  });

  it('should show error if firstname or lastname is missing', () => {
    component.firstname.set('');
    component.lastname.set('Mustermann');

    component.submitForm();

    expect(mockToaster.show).toHaveBeenCalledWith(
      'Vor- oder Nachname wurde nicht eingetragen!'
    );

    expect(mockUserState.createUser).not.toHaveBeenCalled();
  });
});
