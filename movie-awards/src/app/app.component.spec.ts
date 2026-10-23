
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterOutlet],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve possuir o título movie-awards', () => {
    expect(component.title).toBe('movie-awards');
  });

  it('deve renderizar o router-outlet', () => {
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');

    expect(routerOutlet).not.toBeNull();
  });
});
