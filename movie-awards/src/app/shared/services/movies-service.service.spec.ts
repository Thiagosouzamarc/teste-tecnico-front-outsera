import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { MoviesServiceService } from './movies-service.service';

describe('MoviesServiceService', () => {
  let service: MoviesServiceService;
  let httpMock: HttpTestingController;

  const url = 'https://challenge.outsera.tech/api/movies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(MoviesServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch years with multiple winners', () => {
    const mockData = {
      years: [{ year: 1986, winnerCount: 2 }],
    };

    service.getYearsWinners().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${url}/yearsWithMultipleWinners`);

    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch studios with the most wins', () => {
    const mockData = {
      studios: [{ name: 'Studio A', winCount: 5 }],
    };

    service.getTopStudios().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${url}/studiosWithWinCount`);

    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch producer win intervals', () => {
    const mockData = {
      min: [],
      max: [],
    };

    service.getIntervalBetw().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${url}/maxMinWinIntervalForProducers`);

    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch winners for a specific year', () => {
    const year = 2020;
    const mockData = [{ id: 1, year: 2020, title: 'Movie A', winner: true }];

    service.getWinByYear(year).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${url}/winnersByYear?year=${year}`);

    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch movies with page, size, winner, and year filters', () => {
    const mockData = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 10,
    };

    service.getListMovies(0, 10, true, 2020).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne((request) => {
      return request.url === url;
    });

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.get('winner')).toBe('true');
    expect(req.request.params.get('year')).toBe('2020');

    req.flush(mockData);
  });

  it('should propagate HTTP errors', () => {
    let receivedError: any;

    service.getTopStudios().subscribe({
      next: () => {
        throw new Error('Expected an HTTP error');
      },
      error: (error) => {
        receivedError = error;
      },
    });

    const req = httpMock.expectOne(`${url}/studiosWithWinCount`);

    req.flush('Erro interno', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(receivedError.status).toBe(500);
  });

  describe('catchError scenarios', () => {
    const errorResponse = {
      status: 500,
      statusText: 'Internal Server Error',
    };

    it('should propagate errors from getYearsWinners', () => {
      service.getYearsWinners().subscribe({
        next: () => {
          throw new Error('Expected an HTTP error');
        },
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${url}/yearsWithMultipleWinners`);

      req.flush('Erro interno', errorResponse);
    });

    it('should propagate errors from getTopStudios', () => {
      service.getTopStudios().subscribe({
        next: () => {
          throw new Error('Expected an HTTP error');
        },
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${url}/studiosWithWinCount`);

      req.flush('Erro interno', errorResponse);
    });

    it('should propagate errors from getIntervalBetw', () => {
      service.getIntervalBetw().subscribe({
        next: () => {
          throw new Error('Expected an HTTP error');
        },
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${url}/maxMinWinIntervalForProducers`);

      req.flush('Erro interno', errorResponse);
    });

    it('should propagate errors from getWinByYear', () => {
      service.getWinByYear(2020).subscribe({
        next: () => {
          throw new Error('Expected an HTTP error');
        },
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${url}/winnersByYear?year=2020`);

      req.flush('Erro interno', errorResponse);
    });

    it('should propagate errors from getListMovies', () => {
      service.getListMovies(0, 10, true, 2020).subscribe({
        next: () => {
          throw new Error('Expected an HTTP error');
        },
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne((request) => {
        return request.url === url;
      });

      req.flush('Erro interno', errorResponse);
    });
  });
});
