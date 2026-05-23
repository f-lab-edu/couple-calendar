// MSW runs in dev/test only — modern Node 14.17+ and all current browsers
// in secure contexts (localhost included) support crypto.randomUUID.
export const generateUuid = (): string => crypto.randomUUID();
