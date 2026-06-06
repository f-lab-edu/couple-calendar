import { CoupleDataSource } from "@/data/apis/CoupleDataSource";
import { parseCouple } from "@/data/parsers/coupleParser";
import { parseInviteCode } from "@/data/parsers/inviteCodeParser";
import type Couple from "@/domain/entities/Couple";
import type InviteCode from "@/domain/entities/InviteCode";
import type { CoupleRepository } from "@/domain/repositories/CoupleRepository";

export class CoupleRepositoryImpl implements CoupleRepository {
	constructor(private readonly dataSource: CoupleDataSource = new CoupleDataSource()) {}

	async invite(startDate: string): Promise<InviteCode> {
		const dto = await this.dataSource.invite(startDate);
		return parseInviteCode(dto);
	}

	async connect(inviteCode: string): Promise<Couple> {
		const dto = await this.dataSource.connect(inviteCode);
		return parseCouple(dto);
	}

	async getMyCouple(): Promise<Couple> {
		const dto = await this.dataSource.getMyCouple();
		return parseCouple(dto);
	}

	async updateStartDate(startDate: string): Promise<Couple> {
		const dto = await this.dataSource.updateStartDate(startDate);
		return parseCouple(dto);
	}

	async disconnect(): Promise<void> {
		await this.dataSource.disconnect();
	}
}
