import { MatSnackBar } from '@angular/material/snack-bar';
import { IntervalWins } from './../../../../shared/model/interval-wins';
import { MoviesServiceService } from './../../../../shared/services/movies-service.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-interval-bt-wins',
  templateUrl: './interval-bt-wins.component.html',
  styleUrls: ['./interval-bt-wins.component.scss'],
})
export class IntervalBtWinsComponent {
  intervalWins: IntervalWins = {
    min: [],
    max: []
  };

  displayedColumns: string[] = ['produtor', 'intervalo', 'ano ganhador', 'próximo ano ganhador'];

  constructor(
    private moviesServiceService: MoviesServiceService,
    private snackBar: MatSnackBar
  ) {
    this.loadTopStudios();
  }

  loadTopStudios() {
    this.moviesServiceService.getIntervalBetw().subscribe({
      next: (data: IntervalWins) => {
        this.intervalWins = data;
      },
      error: (err) => {
        this.openSnackBar('Erro ao carregar intervalos entre vitórias.', 'Fechar');
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
