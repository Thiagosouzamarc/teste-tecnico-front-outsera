import { MatSnackBar } from '@angular/material/snack-bar';
import { YearsWinners } from './../../../../shared/model/years-winners';
import { MoviesServiceService } from './../../../../shared/services/movies-service.service';
import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-years-with-winners',
  templateUrl: './years-with-winners.component.html',
  styleUrls: ['./years-with-winners.component.scss']
})

export class YearsWithWinnersComponent {

  yearWinners: YearsWinners = {
    years : []
  };
  displayedColumns: string[] = ['year', 'winnerCount'];

  constructor(
    private moviesServiceService: MoviesServiceService,
    private snackBar: MatSnackBar
  ) {
    this.loadYearsWinners();
  }

  loadYearsWinners() {
    this.moviesServiceService.getYearsWinners()
    .subscribe(({
      next: (data: YearsWinners) => {
        this.yearWinners = data;
      },
      error: (err) => {
       this.snackBar.open('Erro ao carregar anos com vencedores.', 'Fechar', {
          duration: 5000
        });
      }
     }))
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
