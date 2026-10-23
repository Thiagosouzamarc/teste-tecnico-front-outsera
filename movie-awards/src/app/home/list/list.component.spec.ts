
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { of, throwError } from 'rxjs';

import { MoviesServiceService } from '../../shared/services/movies-service.service';
import { ListMovie } from '../../shared/model/list.movie';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let moviesService: {
    getListMovies: jest.Mock;
  };
  let snackBar: {
    open: jest.Mock;
  };

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

    snackBar = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
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
      .overrideComponent(ListComponent, {
        set: {
          template: '',
          styles: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com os campos year e winner', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('year')?.value).toBeNull();
    expect(component.form.get('winner')?.value).toBeNull();
  });

  it('deve inicializar a paginação com os valores padrão', () => {
    expect(component.pageIndex).toBe(0);
    expect(component.itemPerPage).toBe(10);
  });

  it('deve carregar os filmes ao inicializar', () => {
    expect(moviesService.getListMovies).toHaveBeenCalledWith(
      0,
      10,
      null,
      null
    );
    expect(component.listMovie).toEqual(mockMovies);
  });

  it('deve atualizar a lista de filmes ao chamar loadMovie', () => {
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
    expect(component.listMovie).toEqual(updatedMovies);
    expect(component.pageIndex).toBe(1);
    expect(component.itemPerPage).toBe(20);
  });

  it('deve enviar os filtros de ano e vencedor ao serviço', () => {
    component.form.patchValue({
      year: 2000,
      winner: 'true',
    });

    component.loadMovie();

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      0,
      10,
      'true',
      2000
    );
  });

  it('deve exibir snackbar quando não encontrar filmes', () => {
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
    expect(component.listMovie).toEqual(emptyResult);
  });

  it('deve exibir snackbar quando ocorrer erro ao carregar filmes', () => {
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

  it('deve atualizar a página e o tamanho ao mudar a paginação', () => {
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

  it('deve reiniciar a página ao pesquisar', () => {
    moviesService.getListMovies.mockReturnValue(
      of({
        ...mockMovies,
        number: 2,
        size: 20,
      }),
    );

    component.onPageChange({ pageIndex: 2, pageSize: 20, length: 100 });

    expect(component.pageIndex).toBe(2);
    expect(component.itemPerPage).toBe(20);

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      2,
      20,
      null,
      null,
    );
  });

  it('deve chamar o serviço com os parâmetros informados em loadMovie', () => {
    component.loadMovie(2, 50);

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      2,
      50,
      null,
      null
    );
  });

  it('deve abrir snackbar com a mensagem e ação informadas', () => {
    component.openSnackBar('Mensagem de teste', 'OK');

    expect(snackBar.open).toHaveBeenCalledWith(
      'Mensagem de teste',
      'OK',
      { duration: 5000 }
    );
  });

  it('deve associar paginator e sort ao dataSource após a inicialização da view', () => {
    const paginatorMock = {} as MatPaginator;
    const sortMock = {} as MatSort;

    component.paginator = paginatorMock;
    component.sort = sortMock;

    component.ngAfterViewInit();

    expect(component.dataSource.paginator).toBe(paginatorMock);
    expect(component.dataSource.sort).toBe(sortMock);
  });

  it('deve aplicar os filtros de ano e vencedor ao pesquisar', () => {
    component.form.patchValue({
      year: 2000,
      winner: 'true',
    });

    component.search();

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      0,
      10,
      'true',
      2000,
    );
  });

  it('deve chamar firstPage do paginator ao pesquisar', () => {
    const paginatorMock = {
      firstPage: jest.fn(),
    } as unknown as MatPaginator;

    component.paginator = paginatorMock;

    component.search();

    expect(paginatorMock.firstPage).toHaveBeenCalledTimes(1);

    expect(moviesService.getListMovies).toHaveBeenLastCalledWith(
      0,
      10,
      null,
      null,
    );
  });
});
