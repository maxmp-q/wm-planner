import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('AppComponent', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
