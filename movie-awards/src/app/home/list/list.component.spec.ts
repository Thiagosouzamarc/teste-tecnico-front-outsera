
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { MoviesServiceService } from '../../shared/services/movies-service.service';
import { ListMovie } from '../../shared/model/list.movie';
import { ListComponent } from './list.component';
import { PageEvent } from '@angular/material/paginator';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let moviesService: {
    getListMovies: jest.Mock;
  };
  let snackBar: MatSnackBar;

  const mockMovies: ListMovie = {
    content: [
      {
        id: 1,
        year: 2000,
        title: 'Filme A',
        studios: ['Studio A'],
        producers: ['Produtor A'],
        winner: true,
      },
      {
        id: 2,
        year: 2001,
        title: 'Filme B',
        studios: ['Studio B'],
        producers: ['Produtor B'],
        winner: false,
      },
    ],
    totalElements: 2,
    totalPages: 1,
    first: true,
    last: true,
    number: 0,
    size: 10,
  };

  beforeEach(async () => {
    moviesService = {
      getListMovies: jest.fn().mockReturnValue(of(mockMovies)),
    };

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        FormBuilder,
        {
          provide: MoviesServiceService,
          useValue: moviesService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    snackBar = fixture.debugElement.injector.get(MatSnackBar);
    jest.spyOn(snackBar, 'open');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with year and winner fields', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('year')?.value).toBeNull();
    expect(component.form.get('winner')?.value).toBeNull();
  });

  it('should initialize pagination with the default values', () => {
    expect(component.pageIndex).toBe(0);
    expect(component.itemPerPage).toBe(10);
  });

  it('should load movies on initialization', () => {
    expect(moviesService.getListMovies).toHaveBeenCalledWith(
      0,
      10,
      null,
      null
    );
    expect(component.listMovie()).toEqual(mockMovies);
  });

  it('should update the movie list when loadMovie is called', () => {
    const updatedMovies: ListMovie = {
      ...mockMovies,
      content: [
        {
          id: 3,
          year: 2020,
          title: 'Filme C',
          studios: ['Studio C'],
          producers: ['Produtor C'],
          winner: true,
        },
      ],
      number: 1,
      size: 20,
    };

    moviesService.getListMovies.mockReturnValue(of(updatedMovies));

    component.loadMovie(1, 20);

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      1,
      20,
      null,
      null
    );
    expect(component.listMovie()).toEqual(updatedMovies);
    expect(component.pageIndex).toBe(1);
    expect(component.itemPerPage).toBe(20);
  });

  it('should apply filters only after the search is submitted', () => {
    component.form.patchValue({
      year: 2000,
      winner: true,
    });

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(0, 10, null, null);

    component.search();

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      0,
      10,
      true,
      2000
    );
  });

  it('should update the table rows when the search button is clicked', () => {
    fixture.detectChanges();
    moviesService.getListMovies.mockClear();

    component.form.patchValue({
      year: 2000,
      winner: true,
    });
    fixture.detectChanges();

    expect(moviesService.getListMovies).not.toHaveBeenCalled();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    );
    button.click();
    fixture.detectChanges();

    expect(moviesService.getListMovies).toHaveBeenCalledWith(0, 10, true, 2000);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('should make a single request when the reset button is clicked', () => {
    fixture.detectChanges();
    moviesService.getListMovies.mockClear();

    component.form.patchValue({
      year: 2000,
      winner: true,
    });
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Reset"]',
    );
    button.click();

    expect(moviesService.getListMovies).toHaveBeenCalledTimes(1);
    expect(moviesService.getListMovies).toHaveBeenCalledWith(0, 10, null, null);
  });

  it('should display a snackbar when no movies are found', () => {
    const emptyResult: ListMovie = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      number: 0,
      size: 10,
    };

    moviesService.getListMovies.mockReturnValue(of(emptyResult));

    component.loadMovie();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Nenhum filme encontrado com os filtros informados.',
      'Fechar',
      { duration: 5000 }
    );
    expect(component.listMovie()).toEqual(emptyResult);
  });

  it('should display a snackbar when loading movies fails', () => {
    moviesService.getListMovies.mockReturnValue(
      throwError(() => new Error('Erro na API'))
    );

    component.loadMovie();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Erro ao carregar filmes.',
      'Fechar',
      { duration: 5000 }
    );
  });

  it('should update the page index and size when pagination changes', () => {
    const event: PageEvent = {
      pageIndex: 2,
      pageSize: 20,
      length: 100,
    };
    moviesService.getListMovies.mockReturnValue(
      of({
        ...mockMovies,
        number: 2,
        size: 20,
      }),
    );

    component.onPageChange(event);

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      2,
      20,
      null,
      null,
    );

    expect(component.pageIndex).toBe(2);
    expect(component.itemPerPage).toBe(20);
  });

  it('should reset the page index when searching', () => {
    moviesService.getListMovies.mockReturnValueOnce(
      of({
        ...mockMovies,
        number: 2,
        size: 20,
      }),
    );
    moviesService.getListMovies.mockReturnValue(
      of({
        ...mockMovies,
        number: 0,
        size: 20,
      }),
    );

    component.onPageChange({ pageIndex: 2, pageSize: 20, length: 100 });

    expect(component.pageIndex).toBe(2);
    expect(component.itemPerPage).toBe(20);

    component.search();

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      0,
      20,
      null,
      null,
    );
  });

  it('should call the service with the parameters passed to loadMovie', () => {
    component.loadMovie(2, 50);

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      2,
      50,
      null,
      null
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

  it('should apply the year and winner filters when searching', () => {
    component.form.patchValue({
      year: 2000,
      winner: true,
    });

    component.search();

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      0,
      10,
      true,
      2000,
    );
  });

  it('should return to the first page when searching', () => {
    const paginatorMock = {
      pageIndex: 2,
    };

    component.paginator = paginatorMock as ListComponent['paginator'];

    component.search();

    expect(paginatorMock.pageIndex).toBe(0);

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      0,
      10,
      null,
      null,
    );
  });
});
