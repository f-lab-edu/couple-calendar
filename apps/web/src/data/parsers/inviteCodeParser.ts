import type { InviteCodeResponse } from "@/data/dto/couple-response";
import InviteCode from "@/domain/entities/InviteCode";

export const parseInviteCode = (raw: InviteCodeResponse): InviteCode =>
	new InviteCode(raw.inviteCode, raw.expiresAt);
