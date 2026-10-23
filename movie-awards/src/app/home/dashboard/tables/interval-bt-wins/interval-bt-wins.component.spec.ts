
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { IntervalWins } from './../../../../shared/model/interval-wins';
import { MoviesServiceService } from './../../../../shared/services/movies-service.service';
import { IntervalBtWinsComponent } from './interval-bt-wins.component';

describe('IntervalBtWinsComponent', () => {
  let component: IntervalBtWinsComponent;
  let fixture: ComponentFixture<IntervalBtWinsComponent>;
  let moviesService: jest.Mocked<Pick<MoviesServiceService, 'getIntervalBetw'>>;
  let snackBar: { open: jest.Mock };

  const mockIntervalWins: IntervalWins = {
    min: [
      {
        producer: 'Produtor A',
        interval: 1,
        previousWin: 1990,
        followingWin: 1991,
      },
    ],
    max: [
      {
        producer: 'Produtor B',
        interval: 20,
        previousWin: 1980,
        followingWin: 2000,
      },
    ],
  };

  beforeEach(async () => {
    moviesService = {
      getIntervalBetw: jest.fn().mockReturnValue(of(mockIntervalWins)),
    };

    snackBar = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [IntervalBtWinsComponent],
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
      .overrideComponent(IntervalBtWinsComponent, {
        set: {
          template: '',
          styles: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(IntervalBtWinsComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar os intervalos como arrays vazios', () => {
    // O construtor chama a API; verificamos o estado inicial
    // antes de executar uma nova chamada manual.
    expect(component.intervalWins).toEqual(mockIntervalWins);
  });

  it('deve chamar o serviço ao inicializar o componente', () => {
    expect(moviesService.getIntervalBetw).toHaveBeenCalled();
  });

  it('deve carregar os intervalos mínimo e máximo', () => {
    component.loadTopStudios();

    expect(moviesService.getIntervalBetw).toHaveBeenCalledTimes(2);
    expect(component.intervalWins).toEqual(mockIntervalWins);
    expect(component.intervalWins.min).toHaveLength(1);
    expect(component.intervalWins.max).toHaveLength(1);
  });

  it('deve exibir snackbar quando ocorrer erro ao carregar os intervalos', () => {
    moviesService.getIntervalBetw.mockReturnValue(
      throwError(() => new Error('Erro na API'))
    );

    component.loadTopStudios();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro ao carregar intervalos entre vitórias.',
      'Fechar',
      { duration: 5000 }
    );
  });

  it('deve abrir o snackbar com a mensagem e a ação informadas', () => {
    component.openSnackBar('Mensagem de teste', 'OK');

    expect(snackBar.open).toHaveBeenCalledWith(
      'Mensagem de teste',
      'OK',
      { duration: 5000 }
    );
  });
});
