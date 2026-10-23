import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { YearsWinners } from '../model/years-winners';
import { TopStudios } from '../model/top-studios';
import { IntervalWins } from '../model/interval-wins';
import { WinnerYears } from '../model/winner-years';
import { ListMovie } from '../model/list.movie';

@Injectable({
  providedIn: 'root',
})
export class MoviesServiceService {
  private url = 'https://challenge.outsera.tech/api/movies';
  constructor(private http: HttpClient) {}

  getYearsWinners(): Observable<YearsWinners> {
    return this.http
      .get<YearsWinners>(this.url + '/yearsWithMultipleWinners')
      .pipe(
        map((data: YearsWinners) => data),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  getTopStudios(): Observable<TopStudios> {
    return this.http.get<TopStudios>(this.url + '/studiosWithWinCount').pipe(
      map((data: TopStudios) => data),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  getIntervalBetw(): Observable<IntervalWins> {
    return this.http
      .get<IntervalWins>(this.url + '/maxMinWinIntervalForProducers')
      .pipe(
        map((data: IntervalWins) => data),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  getWinByYear(year: number): Observable<WinnerYears[]> {
    return this.http
      .get<WinnerYears[]>(this.url + `/winnersByYear?year=${year}`)
      .pipe(
        map((data: WinnerYears[]) => data),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  getListMovies(
    page: number | null,
    size: number | null,
    winner: boolean | null,
    year: number | null,
  ): Observable<ListMovie> {
    let params = new HttpParams();

    if (page !== null) {
      params = params.set('page', page);
    }

    if (size !== null) {
      params = params.set('size', size);
    }

    if (winner !== null) {
      params = params.set('winner', winner);
    }

    if (year !== null) {
      params = params.set('year', year);
    }
    return this.http.get<ListMovie>(this.url, { params }).pipe(
      map((data: ListMovie) => data),
      catchError((error) => throwError(() => error)),
    );
  }
}
