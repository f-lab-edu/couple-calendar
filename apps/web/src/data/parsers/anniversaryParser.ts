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

/** Convert a single AnniversaryResponse DTO into a domain Anniversary entity. */
export const parseAnniversary = (anniversaryDto: AnniversaryResponse): Anniversary =>
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

const AnniversaryParser = (anniversariesDto: AnniversariesDto): Anniversary[] =>
  anniversariesDto.map(parseAnniversary)

export default AnniversaryParser
