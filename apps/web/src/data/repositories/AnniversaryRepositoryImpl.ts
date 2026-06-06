import { AnniversaryDataSource } from "@/data/apis/AnniversaryDataSource";
import type Anniversary from "@/domain/entities/Anniversary";
import type { AnniversaryRepository } from "@/domain/repositories/AnniversaryRepository";

export class AnniversaryRepositoryImpl implements AnniversaryRepository {
	constructor(private readonly dataSource: AnniversaryDataSource = new AnniversaryDataSource()) {}

	async getAnniversaries(): Promise<Anniversary[]> {
		return this.dataSource.getAnniversaries();
	}

	async addAnniversary(anniversary: Anniversary): Promise<void> {
		return this.dataSource.addAnniversary(anniversary);
	}
}
