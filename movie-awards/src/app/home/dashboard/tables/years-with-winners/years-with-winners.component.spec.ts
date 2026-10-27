
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { YearsWinners } from './../../../../shared/model/years-winners';
import { MoviesServiceService } from './../../../../shared/services/movies-service.service';
import { YearsWithWinnersComponent } from './years-with-winners.component';

describe('YearsWithWinnersComponent', () => {
  let component: YearsWithWinnersComponent;
  let fixture: ComponentFixture<YearsWithWinnersComponent>;
  let moviesService: {
    getYearsWinners: jest.Mock;
  };
  let snackBar: {
    open: jest.Mock;
  };

  const mockYearsWinners: YearsWinners = {
    years: [
      { year: 1980, winnerCount: 2 },
      { year: 1990, winnerCount: 3 },
      { year: 2000, winnerCount: 4 },
    ],
  };

  beforeEach(async () => {
    moviesService = {
      getYearsWinners: jest.fn().mockReturnValue(of(mockYearsWinners)),
    };

    snackBar = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [YearsWithWinnersComponent],
      providers: [
        {
          provide: MoviesServiceService,
          useValue: moviesService,
        },
        {
          provide: MatSnackBar,
          useValue: snackBar,
        },
      ],
    })
      .overrideComponent(YearsWithWinnersComponent, {
        set: {
          template: '',
          styles: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(YearsWithWinnersComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call the service on initialization', () => {
    expect(moviesService.getYearsWinners).toHaveBeenCalledTimes(1);
  });

  it('should load years with multiple winners', () => {
    expect(component.yearWinners).toEqual(mockYearsWinners);
    expect(component.yearWinners.years).toHaveLength(3);
  });

  it('should update the data when loadYearsWinners is called', () => {
    const updatedData: YearsWinners = {
      years: [{ year: 2020, winnerCount: 5 }],
    };

    moviesService.getYearsWinners.mockReturnValue(of(updatedData));

    component.loadYearsWinners();

    expect(component.yearWinners).toEqual(updatedData);
    expect(moviesService.getYearsWinners).toHaveBeenCalledTimes(2);
  });

  it('should display a snackbar when loading years fails', () => {
    moviesService.getYearsWinners.mockReturnValue(
      throwError(() => new Error('Erro na API'))
    );

    component.loadYearsWinners();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro ao carregar anos com vencedores.',
      'Fechar',
      { duration: 5000 }
    );
  });

  it('should open a snackbar with the provided message and action', () => {
    component.openSnackBar('Mensagem de teste', 'OK');

    expect(snackBar.open).toHaveBeenCalledWith(
      'Mensagem de teste',
      'OK',
      { duration: 5000 }
    );
  });
});
