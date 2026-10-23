import { MatSnackBar } from '@angular/material/snack-bar';
import { TopStudios } from './../../../../shared/model/top-studios';
import { MoviesServiceService } from './../../../../shared/services/movies-service.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-top-studios',
  templateUrl: './top-studios.component.html',
  styleUrls: ['./top-studios.component.scss'],
})
export class TopStudiosComponent {
  topStudios: TopStudios = {
    studios: [],
  };

  displayedColumns: string[] = ['nome', 'quantidade'];

  constructor(
    private moviesServiceService: MoviesServiceService,
    private snackBar: MatSnackBar
  ) {
    this.loadTopStudios();
  }

  loadTopStudios() {
    this.moviesServiceService.getTopStudios().subscribe({
      next: (data: TopStudios) => {
        this.topStudios = this.topStudios = {
          studios: [...data.studios]
            .sort((a, b) => b.winCount - a.winCount)
            .slice(0, 3),
        };
      },
      error: (err) => {
        this.openSnackBar('Erro ao carregar estudios com mais vitorias.', 'Fechar');
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
