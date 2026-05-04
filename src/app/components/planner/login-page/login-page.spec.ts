import { TestBed } from '@angular/core/testing';
import { LoginPage } from './login-page';
import { AppState } from '../../../store/state';
import { ToasterState } from '../../../store/toaster';

describe('LoginPage', () => {
  let component: LoginPage;

  const mockAppState = {
    loginToApp: jest.fn(),
  };

  const mockToaster = {
    show: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginPage,
        { provide: AppState, useValue: mockAppState },
        { provide: ToasterState, useValue: mockToaster },
      ],
    });

    component = TestBed.inject(LoginPage);
  });

  it('should login and store token', async () => {
    component.username.set('max');
    component.password.set('1234');

    mockAppState.loginToApp.mockResolvedValue('fake-token');

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    await component.loginButton();

    expect(mockAppState.loginToApp).toHaveBeenCalledWith({
      username: 'max',
      password: '1234',
    });

    expect(setItemSpy).toHaveBeenCalledWith('token', 'fake-token');
  });

  it('should show toaster on login failure', async () => {
    component.username.set('max');
    component.password.set('wrong');

    mockAppState.loginToApp.mockRejectedValue(new Error('fail'));

    await component.loginButton();

    expect(mockToaster.show).toHaveBeenCalledWith(
      'Boardname oder Passwort sind falsch!'
    );
  });
});
