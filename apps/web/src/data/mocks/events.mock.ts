import type { EventResponse } from "@/data/dto/event-response";
import eventsFixture from "./events.mock.json";

export const mockEvents: EventResponse[] = eventsFixture as EventResponse[];

export const mockEmptyEvents: EventResponse[] = [];
