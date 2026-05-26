import Anniversary, { type EAnniversaryType } from "@/domain/entities/Anniversary"
import type { AnniversaryResponse, AnniversaryType } from "../dto/anniversary-response"

type AnniversariesDto = AnniversaryResponse[]

const anniversaryTypeParser = (anniversaryDtoType: AnniversaryType): EAnniversaryType => {
  switch(anniversaryDtoType) {
    case AnniversaryType
      return EAnniversaryType.
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
      anniversaryDto.type,
      anniversaryDto.daysUntil,
    )
  )
}

export default AnniversaryParser