import { WinnerYears } from './../../../../shared/model/winner-years';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoviesServiceService } from '../../../../shared/services/movies-service.service';
import { ComponentsModule } from '../../../../shared/components/components.module';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ComponentsModule],
  selector: 'app-winner-by-years',
  templateUrl: './winner-by-years.component.html',
  styleUrls: ['./winner-by-years.component.scss'],
})
export class WinnerByYearsComponent {
  winnerYears = signal<WinnerYears[]>([]);

  displayedColumns: string[] = ['id', 'year', 'title'];

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private moviesServiceService: MoviesServiceService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      year: [null as number | null, [Validators.required, Validators.pattern(/^\d{4}$/)]]
    })
  }

  loadWinByYear() {
    const year = this.form?.controls['year']?.value;
    this.moviesServiceService.getWinByYear(year).subscribe({
      next: (data: WinnerYears[]) => {
        if (data.length === 0) {
          this.openSnackBar('Nenhum vencedor encontrado para o ano informado', 'Fechar');
        }
        this.winnerYears.set(data);
      },
      error: (err) => {
        this.openSnackBar('Erro ao buscar vencedores por ano', 'Fechar');
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
