
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { WinnerByYearsComponent } from './winner-by-years.component';
import { MoviesServiceService } from '../../../../shared/services/movies-service.service';
import { WinnerYears } from '../../../../shared/model/winner-years';

describe('WinnerByYearsComponent', () => {
  let component: WinnerByYearsComponent;
  let fixture: ComponentFixture<WinnerByYearsComponent>;

  let moviesService: {
    getWinByYear: jest.Mock;
  };

  let snackBar: {
    open: jest.Mock;
  };

  const mockWinners: WinnerYears[] = [
    {
      id: 1,
      year: 2020,
      title: 'Movie A',
      studios: ['Studio A'],
      producers: ['Producer A'],
      winner: true,
    },
    {
      id: 2,
      year: 2020,
      title: 'Movie B',
      studios: ['Studio B'],
      producers: ['Producer B'],
      winner: true,
    },
  ];

  beforeEach(async () => {
    moviesService = {
      getWinByYear: jest.fn().mockReturnValue(of(mockWinners)),
    };

    snackBar = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [WinnerByYearsComponent],
      imports: [ReactiveFormsModule],
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
      .overrideComponent(WinnerByYearsComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(WinnerByYearsComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com o campo year vazio', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('year')?.value).toBeNull();
    expect(component.form.invalid).toBe(true);
  });

  it('deve invalidar o formulário quando o ano estiver vazio', () => {
    component.form.controls['year'].setValue(null);

    expect(component.form.invalid).toBe(true);
    expect(component.form.controls['year'].hasError('required')).toBe(true);
  });

  it('deve aceitar um ano com quatro dígitos', () => {
    component.form.controls['year'].setValue(2020);

    expect(component.form.controls['year'].valid).toBe(true);
  });

  it('deve invalidar um ano que não tenha quatro dígitos', () => {
    component.form.controls['year'].setValue(20);

    expect(component.form.controls['year'].hasError('pattern')).toBe(true);
  });

  it('deve buscar os vencedores do ano informado', () => {
    component.form.controls['year'].setValue(2020);

    component.loadWinByYear();

    expect(moviesService.getWinByYear).toHaveBeenCalledWith(2020);
    expect(component.winnerYears).toEqual(mockWinners);
  });

  it('deve exibir mensagem quando nenhum vencedor for encontrado', () => {
    moviesService.getWinByYear.mockReturnValue(of([]));
    component.form.controls['year'].setValue(2020);

    component.loadWinByYear();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Nenhum vencedor encontrado para o ano informado',
      'Fechar',
      { duration: 5000 },
    );

    expect(component.winnerYears).toEqual([]);
  });

  it('deve exibir mensagem quando ocorrer erro na API', () => {
    moviesService.getWinByYear.mockReturnValue(
      throwError(() => new Error('Erro na API')),
    );

    component.form.controls['year'].setValue(2020);

    component.loadWinByYear();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro ao buscar vencedores por ano',
      'Fechar',
      { duration: 5000 },
    );
  });

  it('deve abrir uma notificação manualmente', () => {
    component.openSnackBar('Mensagem de teste', 'Fechar');

    expect(snackBar.open).toHaveBeenCalledWith(
      'Mensagem de teste',
      'Fechar',
      { duration: 5000 },
    );
  });
});
