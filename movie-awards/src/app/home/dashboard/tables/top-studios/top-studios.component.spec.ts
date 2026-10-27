
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { TopStudiosComponent } from './top-studios.component';
import { MoviesServiceService } from '../../../../shared/services/movies-service.service';
import { TopStudios } from '../../../../shared/model/top-studios';

describe('TopStudiosComponent', () => {
  let component: TopStudiosComponent;
  let fixture: ComponentFixture<TopStudiosComponent>;
  let moviesService: {
    getTopStudios: jest.Mock;
  };
  let snackBar: {
    open: jest.Mock;
  };

  const mockStudios: TopStudios = {
    studios: [
      { name: 'Studio C', winCount: 3 },
      { name: 'Studio A', winCount: 10 },
      { name: 'Studio D', winCount: 1 },
      { name: 'Studio B', winCount: 7 },
      { name: 'Studio E', winCount: 5 },
    ],
  };

  beforeEach(async () => {
    moviesService = {
      getTopStudios: jest.fn().mockReturnValue(of(mockStudios)),
    };

    snackBar = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [TopStudiosComponent],
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
      .overrideComponent(TopStudiosComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TopStudiosComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTopStudios on initialization', () => {
    expect(moviesService.getTopStudios).toHaveBeenCalledTimes(1);
  });

  it('should sort studios by win count', () => {
    expect(component.topStudios.studios).toEqual([
      { name: 'Studio A', winCount: 10 },
      { name: 'Studio B', winCount: 7 },
      { name: 'Studio E', winCount: 5 },
    ]);
  });

  it('should return only the three studios with the most wins', () => {
    expect(component.topStudios.studios).toHaveLength(3);
  });

  it('should display a message when the API request fails', () => {
    moviesService.getTopStudios.mockReturnValue(
      throwError(() => new Error('Erro na API')),
    );

    component.loadTopStudios();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro ao carregar estudios com mais vitorias.',
      'Fechar',
      { duration: 5000 },
    );
  });

  it('should allow a notification to be opened manually', () => {
    component.openSnackBar('Mensagem de teste', 'Fechar');

    expect(snackBar.open).toHaveBeenCalledWith(
      'Mensagem de teste',
      'Fechar',
      { duration: 5000 },
    );
  });
});
