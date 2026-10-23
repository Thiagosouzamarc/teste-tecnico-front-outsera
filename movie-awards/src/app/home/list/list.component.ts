import { MoviesServiceService } from '../../shared/services/movies-service.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListMovie } from '../../shared/model/list.movie';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit {
  listMovie: ListMovie = {
    content: [],
    number: 0,
    size: 0
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'ano',
    'título',
    'estudios',
    'produtores',
    'vencedores',
  ];

  vencedor = [
    {value: 'true', viewValue: 'Sim'},
    {value: 'false', viewValue: 'Não'},
  ];

  form!: FormGroup;
  itemPerPage = 10;
  pageIndex = 0;

  constructor(
    private fb: FormBuilder,
    private moviesServiceService: MoviesServiceService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
    this.loadMovie();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initForm() {
    this.form = this.fb.group({
      year: [
        null as number | null,
        [Validators.pattern(/^\d{4}$/)],
      ],
      winner: [null]
    });
  }

  loadMovie(page: number = this.pageIndex, size: number = this.itemPerPage) {
    const year = this.form?.controls['year']?.value;
    const winner = this.form?.controls['winner']?.value;
    this.moviesServiceService.getListMovies(page, size, winner, year).subscribe({
      next: (data: ListMovie) => {
        if (data.content.length === 0) {
          this.openSnackBar('Nenhum filme encontrado com os filtros informados.', 'Fechar');
        }
        this.listMovie = data;
        this.pageIndex = data.number;
        this.itemPerPage = data.size;
      },
      error: (err) => {
        this.openSnackBar('Erro ao carregar filmes.', 'Fechar');
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.itemPerPage = event.pageSize;

    this.loadMovie(this.pageIndex, this.itemPerPage);
  }

  search(): void {
    this.pageIndex = 0;

    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.loadMovie(0, this.itemPerPage);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
