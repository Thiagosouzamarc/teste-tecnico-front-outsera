import { MoviesServiceService } from '../../shared/services/movies-service.service';
import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListMovie } from '../../shared/model/list.movie';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentsModule } from '../../shared/components/components.module';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ComponentsModule],
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  listMovie = signal<ListMovie>({
    content: [],
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'year', 'title', 'winner'];

  vencedor = [
    { value: true, viewValue: 'Yes' },
    { value: false, viewValue: 'No' },
  ];

  form!: FormGroup;
  itemPerPage = 10;
  pageIndex = 0;
  private appliedFilters: { year: number | null; winner: boolean | null } = {
    year: null,
    winner: null,
  };

  constructor(
    private fb: FormBuilder,
    private moviesServiceService: MoviesServiceService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
    this.loadMovie();
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
    this.moviesServiceService.getListMovies(
      page,
      size,
      this.appliedFilters.winner,
      this.appliedFilters.year,
    ).subscribe({
      next: (data: ListMovie) => {
        if (data.content.length === 0) {
          this.openSnackBar(
            'Nenhum filme encontrado com os filtros informados.',
            'Fechar',
          );
        }
        this.listMovie.set(data);
        this.pageIndex = data.number;
        this.itemPerPage = data.size;
      },
      error: () => {
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
    if (this.form.invalid) {
      return;
    }

    this.appliedFilters = {
      year: this.form.controls['year'].value,
      winner: this.form.controls['winner'].value,
    };
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadMovie(0, this.itemPerPage);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  resetForm(): void {
    this.form.reset();
    this.appliedFilters = {
      year: null,
      winner: null,
    };
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadMovie(0, this.itemPerPage);
  }
}
