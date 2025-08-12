export type PaginatedRequestQuery<T> = Promise<{
  data: T[];
  count: number;
}>;
