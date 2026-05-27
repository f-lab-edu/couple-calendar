import type Anniversary from "@/domain/entities/Anniversary";
import { AddAnniversaryUseCase } from "@/domain/useCases/AddAniversaryUseCase";
import { useMutation } from "@tanstack/react-query"
import { AnniversaryRepositoryImpl } from "@/data/repositories/AnniversaryRepositoryImpl";

const anniversaryRepository = new AnniversaryRepositoryImpl()

const useAddAnniversary = () => {
  return useMutation({
    mutationFn: async (anniversary: Anniversary) => {
      return await new AddAnniversaryUseCase(anniversaryRepository).execute(anniversary)
    }
  })
}

export default useAddAnniversary;