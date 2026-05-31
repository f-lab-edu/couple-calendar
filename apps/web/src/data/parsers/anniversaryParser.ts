import Anniversary, { type EAnniversaryType } from "@/domain/entities/Anniversary"
import type { AnniversaryResponse, AnniversaryType } from "../dto/anniversary-response"

type AnniversariesDto = AnniversaryResponse[]

const anniversaryTypeParser = (anniversaryDtoType: AnniversaryType): EAnniversaryType => {
  switch (anniversaryDtoType) {
    case "CUSTOM":
      return "CUSTOM"
    case "AUTO":
      return "AUTO"
    default:
      throw new Error(`Unknown anniversary type from server: ${anniversaryDtoType}`)
  }
}

const AnniversaryParser = (anniversariesDto: AnniversariesDto): Anniversary[] => {
  return anniversariesDto.map((anniversaryDto) => 
    new Anniversary(
      anniversaryDto.id,
      anniversaryDto.coupleId,
      anniversaryDto.title,
      anniversaryDto.date,
      anniversaryDto.isRecurring,
      anniversaryDto.description,
      anniversaryTypeParser(anniversaryDto.type),
      anniversaryDto.daysUntil,
    )
  )
}

export default AnniversaryParser