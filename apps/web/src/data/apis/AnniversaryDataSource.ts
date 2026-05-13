import type { AnniversaryResponse } from "../dto/anniversary-response";
import { mockAutoAnniversaries } from "../mocks";

export class AnniversaryDataSource {
  async getAnniversaries(): Promise<AnniversaryResponse[]> {
    // 추후에 fetcher로 대체
    return Promise.resolve(mockAutoAnniversaries)
  }

  async addAnniversary(anniversary: AnniversaryResponse): Promise<void> {
    // 추후에 fetcher로 대체
    return Promise.resolve()
  }
}