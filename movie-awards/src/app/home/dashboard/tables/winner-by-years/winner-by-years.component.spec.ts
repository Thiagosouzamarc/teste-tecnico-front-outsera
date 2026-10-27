
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

  let snackBar: MatSnackBar;

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

    await TestBed.configureTestingModule({
      imports: [WinnerByYearsComponent],
      providers: [
        {
          provide: MoviesServiceService,
          useValue: moviesService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WinnerByYearsComponent);
    component = fixture.componentInstance;
    snackBar = fixture.debugElement.injector.get(MatSnackBar);
    jest.spyOn(snackBar, 'open');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with an empty year field', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('year')?.value).toBeNull();
    expect(component.form.invalid).toBe(true);
  });

  it('should invalidate the form when the year is empty', () => {
    component.form.controls['year'].setValue(null);

    expect(component.form.invalid).toBe(true);
    expect(component.form.controls['year'].hasError('required')).toBe(true);
  });

  it('should accept a four-digit year', () => {
    component.form.controls['year'].setValue(2020);

    expect(component.form.controls['year'].valid).toBe(true);
  });

  it('should reject a year that does not have four digits', () => {
    component.form.controls['year'].setValue(20);

    expect(component.form.controls['year'].hasError('pattern')).toBe(true);
  });

  it('should fetch the winners for the specified year', () => {
    component.form.controls['year'].setValue(2020);

    component.loadWinByYear();

    expect(moviesService.getWinByYear).toHaveBeenCalledWith(2020);
    expect(component.winnerYears()).toEqual(mockWinners);
  });

  it('should update the table rows when the form is submitted', () => {
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '2020';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(false);
    button.click();
    fixture.detectChanges();

    expect(moviesService.getWinByYear).toHaveBeenCalledWith(2020);
    expect(fixture.nativeElement.querySelectorAll('tr[mat-row]').length).toBe(2);
  });

  it('should display a message when no winners are found', () => {
    moviesService.getWinByYear.mockReturnValue(of([]));
    component.form.controls['year'].setValue(2020);

    component.loadWinByYear();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Nenhum vencedor encontrado para o ano informado',
      'Fechar',
      { duration: 5000 },
    );

    expect(component.winnerYears()).toEqual([]);
  });

  it('should display a message when the API request fails', () => {
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

  it('should open a notification manually', () => {
    component.openSnackBar('Mensagem de teste', 'Fechar');

    expect(snackBar.open).toHaveBeenCalledWith(
      'Mensagem de teste',
      'Fechar',
      { duration: 5000 },
    );
  });
});
