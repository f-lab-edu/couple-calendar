import type Anniversary from "../entities/Anniversary";
import type { AnniversaryRepository } from "../repositories/AnniversaryRepository";

export class AddAnniversaryUseCase {
  constructor(private readonly anniversaryRepository: AnniversaryRepository) {}

  async execute(anniversary: Anniversary): Promise<void> {
    this.anniversaryRepository.addAnniversary(anniversary)
  }
}  
