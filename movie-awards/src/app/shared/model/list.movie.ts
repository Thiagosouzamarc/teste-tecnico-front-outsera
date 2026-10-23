export interface ListMovie {
  content: DataMovie[];
  totalElements?: number;
  last?: boolean;
  totalPages?: number;
  first?: boolean;
  number: number;
  size: number
}

export interface DataMovie {
  id: number;
  year: number;
  title: string;
  studios: string[];
  producers: string[];
  winner: boolean
}
