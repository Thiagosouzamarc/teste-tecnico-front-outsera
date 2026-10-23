export interface IntervalWins {
  min: DataInterval[];
  max: DataInterval[];
}

export interface DataInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}
