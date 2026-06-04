import type { AnniversaryRepository } from "@/domain/repositories/AnniversaryRepository";
import { AnniversaryDataSource } from "../apis/AnniversaryDataSource";
import type Anniversary from "@/domain/entities/Anniversary";

export class AnniversaryRepositoryImpl implements AnniversaryRepository { 
  async getAnniversaries(): Promise<Anniversary[]> {
    return new AnniversaryDataSource().getAnniversaries()
  }  

  async addAnniversary(anniversary: Anniversary): Promise<void> {
    return new AnniversaryDataSource().addAnniversary(anniversary)
  }
}
  
