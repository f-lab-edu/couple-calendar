import { anniversariesHandlers } from "./anniversaries.handlers";
import { authHandlers } from "./auth.handlers";
import { couplesHandlers } from "./couples.handlers";
import { eventsHandlers } from "./events.handlers";
import { healthHandlers } from "./health.handlers";
import { usersHandlers } from "./users.handlers";

export const handlers = [
	...healthHandlers,
	...authHandlers,
	...usersHandlers,
	...couplesHandlers,
	...eventsHandlers,
	...anniversariesHandlers,
];
