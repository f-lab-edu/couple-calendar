import type Anniversary from "../entities/Anniversary";

export interface AnniversaryRepository {
  getAnniversaries(): Promise<Anniversary[]>
  addAnniversary(anniversary: Anniversary): Promise<void>
}