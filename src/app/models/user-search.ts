export interface CurrentParams {
  q: string;
  page: number;
  per_page: number;
}

export interface CurrentResultsData {
  total_count: number;
}

export interface Pagination {
  arrayLeft: number[];
  arrayRight?: number[];
}
